const models = require("../../../core/models");

//DAO
const customerDao = require("../../../core/dao/customerDao");
const groupDao = require("../../../core/dao/groupDao");
const spendDao = require("../../../core/dao/spendDao");

//SERVICES
const spendServices = require("../../../core/services/spendServices");
const groupServices = require("../../../core/services/groupServices");
const otherServices = require("../../../core/services/otherServices");

//UTILS
const CoreException = require("../../../core/utils/coreException");
const WsException = require("../utils/wsException");
const logger = require("../../../core/utils/logger");
const FILE_NAME = "groupeController";

const groupController = {
	getGroups: async function (req, res, next) {
		try {
			let customer_id = req.session.customer_id;
			if (customer_id == null) throw new WsException(40000);
			let groups = await groupDao.read({
				where: {
					[models.Sequelize.Op.or]: [{ "$creator.id$": customer_id }, { "$member.id$": customer_id }],
				},
				include: [
					{ model: models.customer, as: "creator", attributes: [] },
					{ model: models.customer, as: "member", attributes: [] },
				],
				order: [["updatedAt", "desc"]],
			});
			if (groups === null) groups = [];
			res.send(groups);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - editGroup" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	createGroup: async function (req, res, next) {
		try {
			let { name } = req.body;
			let customer_id = req.session.customer_id;
			if (name == null || customer_id == null) throw new WsException(40000);
			let result = await groupDao.create({ name: name, creator_id: customer_id });
			res.send(result);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - createGroup" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getGroup: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let customer_id = req.session.customer_id;
			if (groupId == null || customer_id == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId }, include: [{ model: models.customer, as: "creator" }] });
			if (group == null) throw new WsException(40000);
			res.send(group);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - editGroup" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	editGroup: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let customer_id = req.session.customer_id;
			let { name } = req.body;
			if (groupId == null || customer_id == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId, creator_id: customer_id } });
			if (group == null) throw new WsException(40000);
			let result = await groupDao.update(group, { name: name });
			res.send(result);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - editGroup" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	deleteGroup: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let customer_id = req.session.customer_id;
			if (groupId == null || customer_id == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId, creator_id: customer_id } });
			if (group == null) throw new WsException(40000);
			let result = await groupDao.delete(group);
			res.send({ data: "ok" });
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - deleteGroup" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},

	listMembers: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let customer_id = req.session.customer_id;
			if (groupId == null || customer_id == null) throw new WsException(40000);
			let group = await groupDao.readOne({
				attributes: [],
				where: { id: groupId },
				include: [
					{ model: models.customer, as: "creator", include: [{ model: models.customer_img, as: "customerImg" }] },
					{ model: models.customer, as: "member", include: [{ model: models.customer_img, as: "customerImg" }] },
				],
			});
			if (group == null) throw new WsException(40402);
			let members = [group.creator, ...group.member];
			res.send(members);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - listMembers" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},

	inviteMember: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			let group = await groupDao.readOne({
				where: { id: groupId },
			});
			if (group == null) throw new WsException(40402);
			res.send(group);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - inviteMember" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getSpends: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId } });
			if (group == null) throw new WsException(40402);
			let data = {};
			let spent = await spendServices.getSpendWithGroupId(groupId);
			data.customerAmount = spent !== null ? spendServices.amountOfCustomer(spent, connecterCustomerId) : 0;
			data.totalAmount = spent !== null ? spendServices.getTotalAmount(spent) : 0;
			data.spends = spent;
			res.send(data);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getSpends" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getSpendsArchives: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let archiveId = req.params.archiveId;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId } });
			if (group == null) throw new WsException(40402);
			let data = {};

			let archiveObject = otherServices.getArchiveFromId(archiveId);
			let spent = await spendServices.getSpendWithGroupIdAndDate(id, archiveObject.firstOfMonth, archiveObject.nextMonth);

			//let spent = await spendServices.getSpendWithGroupId(groupId);
			data.customerAmount = spent !== null ? spendServices.amountOfCustomer(spent, connecterCustomerId) : 0;
			data.totalAmount = spent !== null ? spendServices.getTotalAmount(spent) : 0;
			data.spends = spent;
			res.send(data);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getSpends" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getDebts: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId } });
			if (group == null) throw new WsException(40402);

			let spent = await spendServices.getSpendWithGroupId(group.id);
			let debts = spent != null ? spendServices.splitPayments(spent) : [];
			let debtsWithCustomer = await spendServices.getCustomerOfDebt(debts);

			res.send(debtsWithCustomer);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getDebts" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getArchives: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			let group = await groupDao.readOne({ where: { id: groupId } });
			if (group === null) throw new WebException(40402);
			let allSpend = await spendServices.getSpendWithGroupId(groupId);
			let archive = spendServices.getArchiveList(allSpend);
			res.send(archive);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getArchives" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	getOptions: async function (req, res, next) {
		try {
			let groupId = req.params.id;
			let connecterCustomerId = req.session.customer_id;
			if (groupId == null || connecterCustomerId == null) throw new WsException(40000);
			//Récupération du group et de ses options
			let group = await groupDao.readOne({ where: { id: groupId }, include: [{ model: models.option, as: "options", through: models.group_option }] });
			if (group === null) throw new WebException(40402);
			let options = await groupServices.getGroupOption(group);
			res.send(options);
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getOptions" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
};

module.exports = groupController;
