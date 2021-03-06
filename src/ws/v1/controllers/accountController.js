const models = require("../../../core/models");

//DAO
const customerDao = require("../../../core/dao/customerDao");

//UTILS
const CoreException = require("../../../core/utils/coreException");
const WsException = require("../utils/wsException");
const logger = require("../../../core/utils/logger");
const CONSTANTE = require("../../../core/utils/constant");
const FILE_NAME = "authController";

const accountController = {
	getAccount: async function (req, res, next) {
		try {
			let customerId = req.session.customer_id;
			let customer = await customerDao.readOne({
				where: { id: customerId },
				include: [
					{ model: models.customer_img, as: "customerImg" },
					{ model: models.customer, as: "friends", through: models.friend, include: [{ model: models.customer_img, as: "customerImg" }] },
					{ model: models.customer, as: "userFriends", include: [{ model: models.customer_img, as: "customerImg" }] },
				],
			});
			res.send(customer);
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getAccount" });
			}
			//res.status(err.status);
			//delete err.status;
			res.send(err);
		}
	},
	editAccount: async function (req, res, next) {
		try {
			let customerId = req.session.customer_id;
			let { displayName, img } = req.body;
			if (displayName == null || img == null || customerId == null) throw new WebException(40000);
			let customer = await customerDao.readOne({ where: { id: customerId } });
			customer = await customerDao.update(customer, { displayName: displayName.trim(), img_id: img });
			customer = await customerDao.readOne({
				where: { id: customer.id },
				include: [
					{ model: models.customer_img, as: "customerImg" },
					{ model: models.customer, as: "friends", through: models.friend, include: [{ model: models.customer_img, as: "customerImg" }] },
					{ model: models.customer, as: "userFriends", include: [{ model: models.customer_img, as: "customerImg" }] },
				],
			});
			res.send(customer);
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - editAccount" });
			}
			//res.status(err.status);
			//delete err.status;
			res.send(err);
		}
	},
};

module.exports = accountController;
