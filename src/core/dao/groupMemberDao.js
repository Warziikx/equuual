const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "groupMemberDao";

const groupMemberDao = {
	create: async (object) => {
		return await models.group_member
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50070);
			});
	},
	read: async (object) => {
		let groupMember = await models.group_member.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50071);
		});
		if (groupMember.length > 0) return groupMember;
		else return null;
	},
	readOne: async (object) => {
		let groupMember = await models.group_member.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50072);
		});
		if (groupMember.length > 0) return groupMember[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50073);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50074);
		});
	},
};

module.exports = groupMemberDao;
