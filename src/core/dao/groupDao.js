const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "groupDao";

const groupDao = {
	create: async (object) => {
		return await models.group
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50030);
			});
	},
	read: async (object) => {
		let utilisateur = await models.group.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50031);
		});
		if (utilisateur.length > 0) return utilisateur;
		else return null;
	},
	readOne: async (object) => {
		let utilisateur = await models.group.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50032);
		});
		if (utilisateur.length > 0) return utilisateur[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50033);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50034);
		});
	},
};

module.exports = groupDao;
