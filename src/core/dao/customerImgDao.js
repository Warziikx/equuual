const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "customerImgDao";

const customerImgDao = {
	create: async (object) => {
		return await models.customer_img
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50080);
			});
	},
	read: async (object) => {
		let utilisateur = await models.customer_img.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50081);
		});
		if (utilisateur.length > 0) return utilisateur;
		else return null;
	},
	readOne: async (object) => {
		let utilisateur = await models.customer_img.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50082);
		});
		if (utilisateur.length > 0) return utilisateur[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50083);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50084);
		});
	},
};

module.exports = customerImgDao;
