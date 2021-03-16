const models = require("../../core/models");
const { Op } = models.Sequelize;

const Promise = require("bluebird");

//DAO
const groupDao = require("../../core/dao/groupDao");
const spendDao = require("../../core/dao/spendDao");
const spendCustomerDao = require("../../core/dao/spendCustomerDao");
const groupMemberDao = require("../../core/dao/groupMemberDao");
const customerDao = require("../../core/dao/customerDao");
const groupOptionDao = require("../../core/dao/groupOptionDao");
const categoryDao = require("../../core/dao/categoryDao");

//SERVICES
const groupServices = require("../../core/services/groupServices");
const spendServices = require("../../core/services/spendServices");
const otherServices = require("../../core/services/otherServices");

//UTILS
const logger = require("../../core/utils/logger");
const WebException = require("../utils/webException");
const CoreException = require("../../core/utils/coreException");
const CONSTANT = require("../../core/utils/constant");
const FILE_NAME = "groupController";

const groupController = {
	/* ------------------------- Default Group Option ------------------------- */
	dispatchGroups: async function (req, res, next) {
		let customer_id = req.session.user.id;
		let groups = await groupDao.read({
			where: {
				[models.Sequelize.Op.or]: [{ "$creator.id$": customer_id }, { "$member.id$": customer_id }],
			},
			include: [
				{ model: models.customer, as: "creator" },
				{ model: models.customer, as: "member" },
			],
			order: [["updatedAt", "desc"]],
		});
		if (groups === null) groups = [];
		res.render("group/groups", {
			groups: groups,
			success: req.flash("success"),
			err: req.flash("error"),
		});
	},
	newGroup: async function (req, res, next) {
		try {
			let { name } = req.body;
			if (name == null) throw new WebException(40000);
			//let result = await groupDao.readOne({ where: { name: name } });
			let customer_id = req.session.user.id;
			result = await groupDao.create({ name: name, creator_id: customer_id });
			req.flash("success", { message: "Ajout réussi" });
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - newGroup",
					vc,
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	editGroup: async function (req, res, next) {
		try {
			console.log(req.body);
			let { id } = req.params;
			let { name, optionActive, optionId } = req.body;
			if (id == null) throw new WebException(40000);
			let result = await groupDao.readOne({ where: { id: id } });
			if (result === null) throw new WebException(40402);
			let obj = {};
			obj.name = name !== null ? name : result.name;
			result = await groupDao.update(result, obj);

			await optionId.map(async (currentId, index) => {
				let optionObj = await groupOptionDao.readOne({ where: { id_group: id, id_option: currentId } });
				let optionValue = optionActive[index];
				if (optionValue === "true" && optionObj === null) {
					await groupOptionDao.create({ id_group: id, id_option: currentId });
				}
				if (optionValue !== "true" && optionObj !== null) {
					await groupOptionDao.delete(optionObj);
				}
			});

			req.flash("success", { message: "Modification réussie" });
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - editGroup",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	deleteGroup: async function (req, res, next) {
		try {
			let { id } = req.params;
			if (id == null) throw new WebException(40000);
			let result = await groupDao.readOne({ where: { id: id } });
			if (result === null) throw new WebException(40402);
			result = await groupDao.delete(result);
			req.flash("success", { message: "Suppression réussie" });
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - deleteGroup",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	/* --------------------------------------------------------------------------- */
	dispatchGroup: async function (req, res, next) {
		try {
			let { id, archiveId } = req.params;
			let customer_id = req.session.user.id;
			if (id == null) throw new WebException(40000);

			//Récupération du group et de ses options
			let group = await groupDao.readOne({ where: { id: id }, include: [{ model: models.option, as: "options", through: models.group_option }] });
			if (group === null) throw new WebException(40402);
			let options = await groupServices.getGroupOption(group);
			let spent = null,
				archiveText = null,
				archive = null,
				debts = [];
			if (groupServices.isGroupArchiveActivated(group)) {
				let archiveObject = otherServices.getArchiveFromId(archiveId);
				archiveText = archiveObject.displayText;
				group = await groupServices.getGroupWithIdAndDate(id, archiveObject.firstOfMonth, archiveObject.nextMonth);
				spent = await spendServices.getSpendWithGroupIdAndDate(id, archiveObject.firstOfMonth, archiveObject.nextMonth);
				let allSpend = await spendServices.getSpendWithGroupId(id);
				archive = spendServices.getArchiveList(allSpend);
				debts = allSpend != null ? spendServices.splitPayments(allSpend) : [];
			} else {
				group = await groupServices.getGroupWithId(id);
				spent = await spendServices.getSpendWithGroupId(id);
				debts = spent != null ? spendServices.splitPayments(spent) : [];
			}

			//let debts = spent != null ? spendServices.splitPayments(spent) : [];
			let friendNotInGroup = await groupServices.getFriendNotInGroup(customer_id, group);

			group.customerAmount = spent !== null ? spendServices.amountOfCustomer(spent, customer_id) : 0;
			group.totalAmount = spent !== null ? spendServices.getTotalAmount(spent) : 0;

			res.render("group/group", {
				group: group,
				customer: friendNotInGroup,
				debts: debts,
				archive: archive,
				archiveText: archiveText,
				archiveId: archiveId,
				options: options,
				success: req.flash("success"),
				err: req.flash("error"),
			});
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - dispatchGroup" });
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	addMember: async function (req, res, next) {
		try {
			let { id } = req.params;
			let { friend } = req.body;
			if (id == null || friend == null) throw new WebException(40000);
			let groupMember = await groupMemberDao.readOne({
				where: { id_group: id, id_customer: friend },
			});
			if (groupMember !== null) throw new WebException(40402);
			await groupMemberDao.create({ id_group: id, id_customer: friend });
			res.redirect(`/web/group/${id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - addMember",
				});
			}
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
	removeMember: async function (req, res, next) {
		try {
			let { id, memberId } = req.params;
			if (id == null || memberId == null) throw new WebException(40000);
			let groupMember = await groupMemberDao.readOne({
				where: { id_group: id, id_customer: memberId },
			});
			if (groupMember === null) throw new WebException(40402);
			await groupMemberDao.delete(groupMember);
			res.redirect(`/web/group/${id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - removeMember",
				});
			}
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
};

module.exports = groupController;
