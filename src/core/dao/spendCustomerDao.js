const models = require("../models");

//UTILS
const CoreException = require("../utils/coreException");
const logger = require("../utils/logger");

const FILE_NAME = "spendCustomerDao";

const spendCustomerDao = {
	create: async (object) => {
		return await models.spend_customer
			.build(object)
			.save()
			.catch((err) => {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - create" });
				throw new CoreException(50060);
			});
	},
	read: async (object) => {
		let spend_customer = await models.spend_customer.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - read" });
			throw new CoreException(50061);
		});
		if (spend_customer.length > 0) return spend_customer;
		else return null;
	},
	readOne: async (object) => {
		let spend_customer = await models.spend_customer.findAll(object).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - readOne" });
			throw new CoreException(50062);
		});
		if (spend_customer.length > 0) return spend_customer[0];
		else return null;
	},
	update: async (object, model) => {
		return await object.update(model).catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - update" });
			throw new CoreException(50063);
		});
	},
	delete: async (object) => {
		return await object.destroy().catch((err) => {
			logger.exception({ err: err, debugMsg: FILE_NAME + " - delete" });
			throw new CoreException(50064);
		});
	},
};

module.exports = spendCustomerDao;
