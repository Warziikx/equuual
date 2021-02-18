const models = require("../models");
const { Op } = models.Sequelize;

//DAO
const spendDao = require("../dao/spendDao");

//UTILS
const logger = require("../utils/logger");
const CoreException = require("../utils/coreException");
const CONSTANT = require("../utils/constant");
const FILE_NAME = "spendServices";

const spendServices = {
	getSpendWithGroupIdAndDate: async function (id, firstOfMonth, nextMonth) {
		let spend = await spendDao.read({
			where: { group_id: id, date: { [Op.gt]: firstOfMonth, [Op.lt]: nextMonth } },
			include: [
				{
					model: models.customer,
					as: "percent_divide",
					through: models.spend_customer,
				},
				{ model: models.customer, as: "payer" },
				{
					model: models.category,
					as: "category",
				},
			],
		});
		return spend;
	},
	getSpendWithGroupId: async function (id) {
		let spend = await spendDao.read({
			where: { group_id: id },
			include: [
				{
					model: models.customer,
					as: "percent_divide",
					through: models.spend_customer,
				},
				{ model: models.customer, as: "payer" },
				{
					model: models.category,
					as: "category",
				},
			],
			order: [["date", "DESC"]],
		});
		return spend;
	},
	getSpendWithGroupIdWithoutReport: async function (id) {
		let spend = await spendDao.read({
			where: { group_id: id },
			include: [
				{
					model: models.customer,
					as: "percent_divide",
					through: models.spend_customer,
				},
				{ model: models.customer, as: "payer" },
				{
					model: models.category,
					as: "category",
					where: { [Op.not]: [{ id: 1 }] },
				},
			],
			order: [["date", "DESC"]],
		});
		return spend;
	},
	amountOfCustomer: function (spendList, id) {
		let total = spendList
			.filter((spend) => {
				return spend.category.id != 1;
			})
			.reduce((acc, curr) => {
				if (curr.payer.id === id) {
					return acc + curr.amount;
				} else {
					return acc;
				}
			}, 0);
		return Math.round((total + Number.EPSILON) * 100) / 100;
	},
	getTotalAmount: function (spendList) {
		let total = spendList
			.filter((spend) => {
				return spend.category.id != 1;
			})
			.reduce((acc, curr) => {
				return acc + curr.amount;
			}, 0);
		return Math.round((total + Number.EPSILON) * 100) / 100;
	},
	splitPayments: function (payments) {
		let customerArray = [];
		payments.map((payment) => {
			let totalNbParts = payment.percent_divide.reduce((acc, curr) => {
				return acc + curr.spend_customer.nb_part;
			}, 0);
			payment.percent_divide.map((customer) => {
				if (customer.id != payment.payer_id) {
					let index = customerArray.findIndex((el) => el.id === customer.id);
					if (index === -1) {
						customerArray.push({
							name: customer.login,
							displayName: customer.displayName,
							id: customer.id,
							amount: -(payment.amount * (customer.spend_customer.nb_part / totalNbParts)),
						});
					} else {
						customerArray[index].amount -= payment.amount * (customer.spend_customer.nb_part / totalNbParts);
					}
					let payerIndex = customerArray.findIndex((el) => el.id === payment.payer_id);
					if (payerIndex === -1) {
						customerArray.push({
							name: payment.payer.login,
							displayName: payment.payer.displayName,
							id: payment.payer_id,
							amount: payment.amount * (customer.spend_customer.nb_part / totalNbParts),
						});
					} else {
						customerArray[payerIndex].amount += payment.amount * (customer.spend_customer.nb_part / totalNbParts);
					}
				}
			});
		});
		let positiveCustomerArray = customerArray.filter((customer) => customer.amount >= 0);
		let negativeCustomerArray = customerArray.filter((customer) => customer.amount < 0);
		let debtArray = [];
		negativeCustomerArray.map((negativeCustomer) => {
			for (let i = 0; i < positiveCustomerArray.length; i++) {
				let positiveCustomer = positiveCustomerArray[i];
				if (positiveCustomer.amount > 0) {
					if (-negativeCustomer.amount < positiveCustomer.amount) {
						let debtAmount = -negativeCustomer.amount;
						debtArray.push({
							from: negativeCustomer.displayName,
							fromId: negativeCustomer.id,
							to: positiveCustomer.displayName,
							toId: positiveCustomer.id,
							amount: debtAmount,
						});
						negativeCustomer.amount = 0;
						positiveCustomer.amount -= negativeCustomer.amount;
						break;
					} else {
						let debtAmount = positiveCustomer.amount;
						debtArray.push({
							from: negativeCustomer.displayName,
							fromId: negativeCustomer.id,
							to: positiveCustomer.displayName,
							toId: positiveCustomer.id,
							amount: debtAmount,
						});
						positiveCustomer.amount = 0;
						negativeCustomer.amount += positiveCustomer.amount;
					}
				}
			}
		});
		debtArray = debtArray.filter((debt) => {
			return debt.amount > 0.01;
		});
		return debtArray;
	},
	getArchiveList: function (payments) {
		let now = new Date();
		let archiveList = [];
		if (payments != null) {
			payments.map((payment) => {
				let dateString = payment.date.getMonth() + 1 + "_" + payment.date.getFullYear();
				let obj = { key: dateString, display: CONSTANT.MONTH_LIST[payment.date.getMonth()] + " " + payment.date.getFullYear() };
				if (archiveList.some((el) => el.key == dateString) === false && !(now.getMonth() === payment.date.getMonth() && now.getFullYear() === payment.date.getFullYear()))
					archiveList.push(obj);
			});
		}
		return archiveList;
	},
};

module.exports = spendServices;
