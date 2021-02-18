const models = require("../models");
const { Op } = models.Sequelize;

//DAO
const groupDao = require("../dao/groupDao");

//UTILS
const logger = require("../utils/logger");
const CoreException = require("../utils/coreException");
const CONSTANT = require("../utils/constant");
const FILE_NAME = "otherServices";

const otherServices = {
	getArchiveFromId(archiveId) {
		let archiveObject = {};
		if (archiveId !== null && archiveId !== undefined) {
			let pieces = archiveId.split("_");
			now = new Date(pieces[1], parseInt(pieces[0]) - 1, 1);
			archiveObject.displayText = CONSTANT.MONTH_LIST[parseInt(pieces[0]) - 1] + " " + pieces[1];
		} else now = new Date();

		archiveObject.nextMonth = now.getMonth() == 11 ? new Date(now.getFullYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
		archiveObject.firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		return archiveObject;
	},
};

module.exports = otherServices;
