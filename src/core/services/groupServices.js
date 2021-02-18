const models = require("../models");
const { Op } = models.Sequelize;

//DAO
const groupDao = require("../dao/groupDao");
const customerDao = require("../dao/customerDao");
const optionDao = require("../dao/optionDao");

//UTILS
const logger = require("../utils/logger");
const CoreException = require("../utils/coreException");
const CONSTANT = require("../utils/constant");
const FILE_NAME = "groupServices";

const groupServices = {
	getGroupWithIdAndDate: async function (id, firstOfMonth, nextMonth) {
		let group = await groupDao.readOne({
			where: { id: id },
			include: [
				{
					model: models.customer,
					as: "creator",
					include: [{ model: models.customer_img, as: "image" }],
				},
				{
					model: models.customer,
					as: "member",
					include: [{ model: models.customer_img, as: "image" }],
				},
				{
					model: models.spend,
					as: "spends",
					where: { date: { [Op.gte]: firstOfMonth, [Op.lt]: nextMonth } },
					required: false,
					include: [
						{ model: models.customer, as: "payer" },
						{
							model: models.category,
							as: "category",
							//where: { [Op.not]: [{ id: 1 }] },
						},
					],
				},
			],
			order: [[{ model: models.spend, as: "spends" }, "date", "DESC"]],
		});
		return group;
	},
	getGroupWithId: async function (id, firstOfMonth, nextMonth) {
		let group = await groupDao.readOne({
			where: { id: id },
			include: [
				{
					model: models.customer,
					as: "creator",
					include: [{ model: models.customer_img, as: "image" }],
				},
				{
					model: models.customer,
					as: "member",
					include: [{ model: models.customer_img, as: "image" }],
				},
				{
					model: models.spend,
					as: "spends",
					required: false,
					include: [
						{ model: models.customer, as: "payer" },
						{
							model: models.category,
							as: "category",
							//where: { [Op.not]: [{ id: 1 }] },
						},
					],
				},
			],
			order: [[{ model: models.spend, as: "spends" }, "date", "DESC"]],
		});
		return group;
	},
	getFriendNotInGroup: async function (customerId, group) {
		let customer = await customerDao.readOne({
			where: { id: customerId },
			include: [
				{
					model: models.customer,
					as: "userFriends",
					through: models.friend,
					where: { "$userFriends->friend.accepted$": true },
				},
			],
		});
		if (customer && customer.userFriends && customer.userFriends.length > 0) {
			customer.userFriends = customer.userFriends.filter(function (friend) {
				return (
					group.member.filter(function (member) {
						return member.id == friend.id;
					}).length == 0
				);
			});
		}
		return customer;
	},
	isGroupArchiveActivated(group) {
		let isArchive = false;
		group.options.map((option) => {
			if (option.name === "archive") isArchive = true;
		});
		return isArchive;
	},
	getGroupOption: async function (group) {
		let allOptions = await optionDao.read({});
		allOptions.map((option) => {
			option.isActive = false;
			group.options.map((groupOption) => {
				if (groupOption.name === option.name) {
					option.isActive = true;
				}
			});
		});
		return allOptions;
	},
};

module.exports = groupServices;
