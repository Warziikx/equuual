const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "customerOriginDao";

const customerOriginDao = {
	create: async (object) => {
		return await models.customer_origin
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50110);
			});
	},
	read: async (object) => {
		let utilisateur = await models.customer_origin.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50111);
		});
		if (utilisateur.length > 0) return utilisateur;
		else return null;
	},
	readOne: async (object) => {
		let utilisateur = await models.customer_origin.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50112);
		});
		if (utilisateur.length > 0) return utilisateur[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50113);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50114);
		});
	},
};

module.exports = customerOriginDao;
