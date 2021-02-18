const models = require("../../core/models");

//DAO
const friendDao = require("../../core/dao/friendDao");
const customerDao = require("../../core/dao/customerDao");

//UTILS
const logger = require("../../core/utils/logger");
const WebException = require("../utils/webException");
const CoreException = require("../../core/utils/coreException");
const CONSTANT = require("../../core/utils/constant");
const FILE_NAME = "friendController";

const friendController = {
	dispatchFriends: async function (req, res, next) {
		try {
			let customer_id = req.session.user.id;
			let customer = await customerDao.readOne({
				where: { id: customer_id },
				include: [
					{ model: models.customer, as: "friends", through: models.friend, include: [{ model: models.customer_img, as: "image" }] },
					{ model: models.customer, as: "userFriends", include: [{ model: models.customer_img, as: "image" }] },
				],
			});
			res.render("friend/friends", { customer: customer, success: req.flash("success"), err: req.flash("error") });
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - dispatchFriends" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/login");
		}
	},
	addFriend: async function (req, res, next) {
		try {
			let { login } = req.body;
			let customerId = req.session.user.id;
			if (customerId == null || login == null) throw new WebException(40000);
			login = login.trim();
			let searchedCustomer = await customerDao.readOne({ where: { login: login } });
			if (searchedCustomer == null) throw new WebException(40000);
			if (searchedCustomer.id == customerId) throw new WebException(40000);
			let friend = await friendDao.readOne({ where: { customer_id_1: searchedCustomer.id, customer_id_2: customerId } });
			if (friend !== null) {
				await friendDao.update(friend, { accepted: 1 });
				await friendDao.create({ customer_id_1: customerId, customer_id_2: searchedCustomer.id, accepted: 1 });
			} else {
				let alreadyRequested = await friendDao.readOne({ where: { customer_id_1: customerId, customer_id_2: searchedCustomer.id } });
				if (alreadyRequested) {
					friendDao.delete(alreadyRequested);
				} else {
					await friendDao.create({ customer_id_1: customerId, customer_id_2: searchedCustomer.id, accepted: 0 });
				}
			}
			res.redirect("/web/friend");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - addFriend" });
			}
			req.flash("error", err);
			res.redirect("/web/friend");
		}
	},
	validateFriend: async function (req, res, next) {
		try {
			let { id } = req.params;
			let customerId = req.session.user.id;
			if (customerId == null || id == null) throw new WebException(40000);
			let searchedCustomer = await customerDao.readOne({ where: { id: id } });
			if (searchedCustomer == null) throw new WebException(40000);
			if (searchedCustomer.id == customerId) throw new WebException(40000);
			let friend = await friendDao.readOne({ where: { customer_id_1: searchedCustomer.id, customer_id_2: customerId } });
			if (friend !== null) {
				await friendDao.update(friend, { accepted: 1 });
				await friendDao.create({ customer_id_1: customerId, customer_id_2: searchedCustomer.id, accepted: 1 });
			} else {
				let alreadyRequested = await friendDao.readOne({ where: { customer_id_1: customerId, customer_id_2: searchedCustomer.id } });
				if (alreadyRequested) {
					friendDao.delete(alreadyRequested);
				} else {
					await friendDao.create({ customer_id_1: customerId, customer_id_2: searchedCustomer.id, accepted: 0 });
				}
			}
			res.redirect("/web/friend");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - validateFriend" });
			}
			req.flash("error", err);
			res.redirect("/web/friend");
		}
	},
	deleteFriend: async function (req, res, next) {
		try {
			let { id } = req.params;
			let customerId = req.session.user.id;
			if (customerId == null || id == null) throw new WebException(40000);
			let searchedCustomer = await customerDao.readOne({ where: { id: id } });
			if (searchedCustomer == null) throw new WebException(40000);

			let friend = await friendDao.readOne({ where: { customer_id_1: customerId, customer_id_2: searchedCustomer.id } });
			if (friend !== null) {
				if (friend.accepted == 1) {
					let otherFriend = await friendDao.readOne({ where: { customer_id_1: searchedCustomer.id, customer_id_2: customerId } });
					await friendDao.delete(otherFriend);
				}
				await friendDao.delete(friend);
			} else {
				let otherFriend = await friendDao.readOne({ where: { customer_id_1: searchedCustomer.id, customer_id_2: customerId } });
				await friendDao.delete(otherFriend);
			}
			res.redirect("/web/friend");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - deleteFriend" });
			}
			req.flash("error", err);
			res.redirect("/web/friend");
		}
	},
};

module.exports = friendController;
