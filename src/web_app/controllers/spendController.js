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
const FILE_NAME = "spendController";

const spendController = {
	dispatchNewSpend: async function (req, res, next) {
		try {
			let { id } = req.params;
			if (id == null) throw new WebException(40000);
			let group = await groupDao.readOne({
				where: { id: id },
				include: [
					{ model: models.customer, as: "creator" },
					{ model: models.customer, as: "member" },
				],
			});
			let categories = await categoryDao.read({ order: ["is_default"] });
			if (group === null) throw new WebException(40402);
			res.render("spend/spendForm", {
				group: group,
				categories: categories,
				success: req.flash("success"),
				err: req.flash("error"),
			});
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - dispatchNewSpend",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	newSpend: async function (req, res, next) {
		try {
			let { id } = req.params;
			if (id == null) throw new WebException(40000);
			let { name, amount, payer, date, participantId, participe, part, category } = req.body;
			if (name == null || amount == null || payer == null || participantId == null || participe == null || part == null) throw new WebException(40000);
			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);

			group = await groupDao.update(group, { updatedAt: new Date(), forceTimestamps: true });

			let explodedDate = date.split("/");
			let spend = await spendDao.create({
				name: name,
				amount: amount,
				payer_id: payer,
				group_id: group.id,
				category_id: category,
				date: new Date(explodedDate[2], explodedDate[1] - 1, explodedDate[0]),
			});

			await Promise.all(
				participantId.map(async (member, index) => {
					if (participe[index] == "true") {
						await spendCustomerDao.create({
							spend_id: spend.id,
							customer_id: member,
							nb_part: part[index],
						});
					}
				})
			);
			res.redirect(`/web/group/${group.id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - newSpend",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	dispatchSpend: async function (req, res, next) {
		let { spendId, id } = req.params;
		try {
			if (spendId == null) throw new WebException(40000);

			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);

			let spend = await spendDao.readOne({
				where: { id: spendId },
				include: [
					{ model: models.customer, as: "payer" },
					{ model: models.customer, as: "percent_divide", through: { model: models.spend_customer, as: "spend_customer" } },
				],
			});
			let totalNbParts = spend.percent_divide.reduce((acc, curr) => {
				return acc + curr.spend_customer.nb_part;
			}, 0);
			if (spend === null) throw new WebException(40402);
			res.render("spend/spend", {
				spend: spend,
				group: group,
				totalNbParts: totalNbParts,
				success: req.flash("success"),
				err: req.flash("error"),
			});
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - dispatchSpend",
				});
			}
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
	dispatchEditSpend: async function (req, res, next) {
		try {
			let { spendId, id } = req.params;
			if (id == null || spendId == null) throw new WebException(40000);
			let group = await groupDao.readOne({
				where: { id: id },
				include: [
					{ model: models.customer, as: "creator" },
					{ model: models.customer, as: "member" },
				],
			});
			if (group === null) throw new WebException(40402);
			let spend = await spendDao.readOne({
				where: { id: spendId },
				include: [
					{ model: models.customer, as: "payer" },
					{ model: models.customer, as: "percent_divide", through: { model: models.spend_customer, as: "spend_customer" } },
					{ model: models.category, as: "category" },
				],
			});
			console.log(spend.category);
			let categories = await categoryDao.read();
			res.render("spend/spendForm", {
				group: group,
				spend: spend,
				categories: categories,
				success: req.flash("success"),
				err: req.flash("error"),
			});
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - dispatchNewSpend",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	editSpend: async function (req, res, next) {
		try {
			let { id, spendId } = req.params;
			if (id == null || spendId == null) throw new WebException(40000);
			let { name, amount, payer, date, participantId, participe, part, category } = req.body;
			if (name == null || amount == null || payer == null || participantId == null || participe == null || part == null) throw new WebException(40000);
			let group = await groupDao.readOne({
				where: { id: id },
				include: [
					{ model: models.customer, as: "creator" },
					{ model: models.customer, as: "member" },
				],
			});
			if (group === null) throw new WebException(40402);
			let spend = await spendDao.readOne({ where: { id: spendId } });
			if (spend === null) throw new WebException(40402);
			let explodedDate = date.split("/");
			spend = await spendDao.update(spend, {
				name: name,
				amount: amount,
				category_id: category,
				payer_id: payer,
				group_id: group.id,
				date: new Date(explodedDate[2], explodedDate[1] - 1, explodedDate[0]),
			});

			await Promise.mapSeries(participantId, async (member, index) => {
				let spendCustomer = await spendCustomerDao.readOne({ where: { spend_id: spend.id, customer_id: member } });
				if (spendCustomer == null) {
					if (participe[index] == "true") {
						await spendCustomerDao.create({
							spend_id: spend.id,
							customer_id: member,
							nb_part: part[index],
						});
					}
				} else {
					if (participe[index] == "true") {
						await spendCustomerDao.update(spendCustomer, {
							spend_id: spend.id,
							customer_id: member,
							nb_part: part[index],
						});
					} else await spendCustomerDao.delete(spendCustomer);
				}
			});
			res.redirect(`/web/group/${group.id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - editSpend",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	deleteSpend: async function (req, res, next) {
		try {
			let { spendId, id } = req.params;
			if (id == null || spendId == null) throw new WebException(40000);
			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);
			let spend = await spendDao.readOne({ where: { id: spendId } });
			if (spend === null) throw new WebException(40402);

			let spendCustomerArray = await spendCustomerDao.read({ where: { spend_id: spend.id } });
			await Promise.all(
				spendCustomerArray.map(async (spendCustomer) => {
					await spendCustomerDao.delete(spendCustomer);
				})
			);
			await spendDao.delete(spend);

			res.redirect(`/web/group/${id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({
					err: err,
					debugMsg: "BO - " + FILE_NAME + " - deleteSpend",
				});
			}
			req.flash("error", err);
			res.redirect("/web/group");
		}
	},
	refundDebt: async function (req, res, next) {
		try {
			let { fromId, toId, amount, archiveId, from, to } = req.body;
			let { id } = req.params;
			if (fromId == null || toId == null || amount == null) throw new WebException(40000);
			if (archiveId !== null && archiveId !== undefined) {
				let pieces = archiveId.split("_");
				now = new Date(pieces[1], parseInt(pieces[0]), 0);
				archiveText = CONSTANT.MONTH_LIST[parseInt(pieces[0]) - 1] + " " + pieces[1];
			} else now = new Date();
			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);

			let spendObj = { payer_id: fromId, name: `Remboursement de ${from} pour ${to}`, group_id: group.id, date: now, amount: amount };
			let spend = await spendDao.create(spendObj);

			let spendCustomObj = { spend_id: spend.id, customer_id: toId, nb_part: 1 };
			let spendCust = await spendCustomerDao.create(spendCustomObj);

			res.redirect(`/web/group/${id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - newSpend" });
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
	reportdDebt: async function (req, res, next) {
		try {
			let { fromId, toId, amount, archiveId, from, to } = req.body;
			let { id } = req.params;
			if (fromId == null || toId == null || amount == null || archiveId == null) throw new WebException(40000);
			//Get date from  archive
			let pieces = archiveId.split("_");
			archive = new Date(pieces[1], parseInt(pieces[0]), 0);
			archiveText = CONSTANT.MONTH_LIST[parseInt(pieces[0]) - 1] + " " + pieces[1];

			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);

			let oldSpendObj = { payer_id: fromId, name: `Report de ${from} pour ${to}`, group_id: group.id, date: archive, amount: amount };
			let oldSpend = await spendDao.create(oldSpendObj);

			let oldSpendCustomObj = { spend_id: oldSpend.id, customer_id: toId, nb_part: 1 };
			let oldSpendCust = await spendCustomerDao.create(oldSpendCustomObj);

			let now = new Date();

			let spendObj = { payer_id: toId, name: `Report de ${from} pour ${to} - ${archiveText}`, group_id: group.id, date: now, amount: amount };
			let spend = await spendDao.create(spendObj);

			let spendCustomObj = { spend_id: spend.id, customer_id: fromId, nb_part: 1 };
			let spendCust = await spendCustomerDao.create(spendCustomObj);

			res.redirect(`/web/group/${id}`);
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - reportdDebt" });
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
};

module.exports = spendController;
