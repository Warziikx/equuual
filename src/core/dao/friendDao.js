const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "friendDao";

const friendDao = {
	create: async (object) => {
		return await models.friend
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50040);
			});
	},
	read: async (object) => {
		let utilisateur = await models.friend.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50041);
		});
		if (utilisateur.length > 0) return utilisateur;
		else return null;
	},
	readOne: async (object) => {
		let utilisateur = await models.friend.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50042);
		});
		if (utilisateur.length > 0) return utilisateur[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50043);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50044);
		});
	},
};

module.exports = friendDao;
