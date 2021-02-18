const models = require("../../core/models");

//UTILS
const logger = require("../../core/utils/logger");
const WebException = require("../utils/webException");
const CoreException = require("../../core/utils/coreException");
const CONSTANTE = require("../../core/utils/constant");
const FILE_NAME = "accountController";

//DAO
const customerImgDao = require("../../core/dao/customerImgDao");
const customerDao = require("../../core/dao/customerDao");

const accountController = {
	dispatchAccount: async function (req, res, next) {
		res.render("account/account", { success: req.flash("success"), err: req.flash("error") });
	},
	dispatchEditAccount: async function (req, res, next) {
		let customerImg = await customerImgDao.read({});
		res.render("account/accountForm", { customerImg: customerImg, success: req.flash("success"), err: req.flash("error") });
	},
	editAccount: async function (req, res, next) {
		try {
			let customer_id = req.session.user.id;
			let { displayName, img } = req.body;
			if (displayName == null || img == null) throw new WebException(40000);
			let customer = await customerDao.readOne({ where: { id: customer_id } });
			if (customer == null) throw new WebException(40900);
			customer = await customerDao.update(customer, { displayName: displayName.trim(), img_id: img });
			customer = await customerDao.readOne({ where: { id: customer.id }, include: [{ model: models.customer_img, as: "image" }] });
			req.session.user = customer;
			res.locals.user = customer;
			res.redirect("/web/account");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- editAccount" });
			}
			req.flash("error", err);
			res.redirect("/web/account/edit");
		}
	},
};

module.exports = accountController;
