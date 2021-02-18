const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "customerDao";

const customerDao = {
	create: async (object) => {
		return await models.customer
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50010);
			});
	},
	read: async (object) => {
		let utilisateur = await models.customer.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50011);
		});
		if (utilisateur.length > 0) return utilisateur;
		else return null;
	},
	readOne: async (object) => {
		let utilisateur = await models.customer.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50012);
		});
		if (utilisateur.length > 0) return utilisateur[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50013);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50014);
		});
	},
};

module.exports = customerDao;
