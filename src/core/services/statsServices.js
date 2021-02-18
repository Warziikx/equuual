const models = require("../models");

//UTILS
const logger = require("../utils/logger");
const CoreException = require("../utils/coreException");
const CONSTANT = require("../utils/constant");
const FILE_NAME = "statsServices";

const statsServices = {
	getSpendCategoryRepartition: function (spendList) {
		let data = [];
		spendList
			.filter((spend) => {
				return spend.category.id != 1;
			})
			.map((spend) => {
				let index = data.findIndex((el) => el.categoryId === spend.category.id);
				if (index != -1) {
					data[index].spendAmount += spend.amount;
				} else {
					let newObject = {};
					newObject.categoryId = spend.category.id;
					newObject.categoryName = spend.category.name;
					newObject.categoryColor = spend.category.color;
					newObject.spendAmount = spend.amount;
					data.push(newObject);
				}
			});
		return data;
	},
};

module.exports = statsServices;
