const models = require("../../../core/models");

//DAO
const friendDao = require("../../../core/dao/friendDao");
const customerDao = require("../../../core/dao/customerDao");

//UTILS
const CoreException = require("../../../core/utils/coreException");
const WsException = require("../utils/wsException");
const logger = require("../../../core/utils/logger");
const CONSTANTE = require("../../../core/utils/constant");
const FILE_NAME = "friendController";

const friendController = {
	getFriends: async function (req, res, next) {
		try {
			let customerId = req.session.customer_id;
			let customer = await customerDao.readOne({
				where: { id: customerId },
				include: [
					{ model: models.customer, as: "friends", through: models.friend, include: [{ model: models.customer_img, as: "image" }] },
					{ model: models.customer, as: "userFriends", include: [{ model: models.customer_img, as: "image" }] },
				],
			});
			res.send([...customer.friends, ...customer.userFriends]);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + "- getFriends" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	requestFriend: async function (req, res, next) {
		try {
			let { friendId } = req.body;
			let customerId = req.session.customer_id;
			let friend = await friendDao.readOne({ where: { customer_id_1: friendId, customer_id_2: customerId } });
			if (friend !== null) {
				await friendDao.update(friend, { accepted: 1 });
				await friendDao.create({ customer_id_1: customerId, customer_id_2: friendId, accepted: 1 });
			} else {
				let alreadyRequested = await friendDao.readOne({ where: { customer_id_1: customerId, customer_id_2: friendId } });
				if (alreadyRequested) {
					friendDao.delete(alreadyRequested);
				} else {
					await friendDao.create({ customer_id_1: customerId, customer_id_2: friendId, accepted: 0 });
				}
			}
			res.send({ data: "OK" });
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + "- requestFriend" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
};

module.exports = friendController;
