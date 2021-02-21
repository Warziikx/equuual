const models = require("../../core/models");

//DAO
const customerDao = require("../../core/dao/customerDao");
const customerImgDao = require("../../core/dao/customerImgDao");

//UTILS
const logger = require("../../core/utils/logger");
const mailer = require("../../core/utils/mailer");
const WebException = require("../utils/webException");
const CoreException = require("../../core/utils/coreException");
const CONSTANTE = require("../../core/utils/constant");
const FILE_NAME = "authController";

//OTHER
const blake = require("blakejs");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const fs = require("fs");
const jwt = require("jsonwebtoken");

passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(
	new FacebookStrategy(
		{
			clientID: "193375215807360",
			clientSecret: "c43938c2ef5520ddd1a8908a59baa3a9",
			callbackURL: "http://localhost:4000/auth/facebook/callback",
			profileFields: ["email", "name"],
		},
		function (accessToken, refreshToken, profile, done) {
			customerDao.readOne({ where: { login: profile.id } }).then((user) => {
				if (user == null) {
					customerDao.create({ login: profile.id, img_id: 1, displayName: profile.name.givenName + " " + profile.name.familyName }).then((customer) => {
						/*req.session.user = customer;
						res.locals.user = customer;*/
						done(null, customer);
					});
				} else {
					done(null, user);
				}
			});
		}
	)
);

const authController = {
	dispatchLogin: async function (req, res, next) {
		res.render("auth/login", { success: req.flash("success"), err: req.flash("error") });
	},
	dispatchRegister: async function (req, res, next) {
		let customerImg = await customerImgDao.read({});
		res.render("auth/register", { customerImg: customerImg, success: req.flash("success"), err: req.flash("error") });
	},
	dispatchForgotPassword: async function (req, res, next) {
		res.render("auth/forgot_password", { success: req.flash("success"), err: req.flash("error") });
	},
	dispatchResetPassword: async function (req, res, next) {
		try {
			let { token } = req.query;
			if (token == null) throw new WebException(40000);
			let decoded = jwt.verify(req.query.token, CONSTANTE["TOKEN_KEY"]);
			if (!decoded.customer_id) throw new WebException(40000);
			let customer = await customerDao.readOne({ where: { id: decoded.customer_id, reset_password_token: token } });
			if (customer == null) throw new WebException(40401);
			res.render("auth/reset_password", { token: token, success: req.flash("success"), err: req.flash("error") });
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- dispatchResetPassword" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/login");
		}
	},
	dispatchDefineLogin: async function (req, res, next) {
		res.render("auth/defineLogin", { success: req.flash("success"), err: req.flash("error") });
	},
	defineLogin: async function (req, res, next) {
		try {
			let { login } = req.body;
			let sessionUser = req.session.user;
			if (login == null) throw new WebException(40000);

			let existingCustomer = await customerDao.readOne({ where: { login: login } });
			if (existingCustomer) throw new WebException(40900);

			let customer = await customerDao.readOne({ where: { id: sessionUser.id } });
			customer = await customerDao.update(customer, { login: login });
			customer = await customerDao.readOne({ where: { id: customer.id }, include: [{ model: models.customer_img, as: "customerImg" }] });
			req.session.user = customer;
			res.locals.user = customer;
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- defineLogin" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/defineLogin");
		}
	},
	login: async function (req, res, next) {
		try {
			let { login, password } = req.body;
			let newpass = blake.blake2bHex(CONSTANTE["START_SAL"] + password + CONSTANTE["END_SAL"]);
			let result = await customerDao.readOne({
				where: { login: login.trim(), password: newpass },
				include: [{ model: models.customer_img, as: "customerImg" }],
			});
			if (result === null) {
				throw new WebException(40401);
			}
			req.session.user = result;
			res.locals.user = result;
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- login" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/login");
		}
	},
	register: async function (req, res, next) {
		try {
			let { login, password, img, email } = req.body;
			if (login == null || password == null || img == null || email == null) throw new WebException(40000);
			let newpass = blake.blake2bHex(CONSTANTE["START_SAL"] + password + CONSTANTE["END_SAL"]);
			let customer = await customerDao.readOne({ where: { login: login } });
			if (customer) throw new WebException(40900);
			customer = await customerDao.create({ login: login.trim(), displayName: login.trim(), password: newpass.trim(), img_id: img, email: email.trim() });
			customer = await customerDao.readOne({ where: { id: customer.id }, include: [{ model: models.customer_img, as: "customerImg" }] });
			req.session.user = customer;
			res.locals.user = customer;
			res.redirect("/web/group");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- register" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/register");
		}
	},
	forgotpassword: async function (req, res, next) {
		try {
			let { email } = req.body;
			if (email == null) throw new WebException(40000);
			let customer = await customerDao.readOne({ where: { email: email } });
			if (!customer) throw new WebException(40404);
			let token = jwt.sign(
				{
					customer_id: customer.id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			customer = await customerDao.update(customer, { reset_password_token: token });
			let data = fs.readFileSync(__basedir + "/public/mail_template/forgot_password.html", { encoding: "utf8", flag: "r" });
			data = data.replace("{%token%}", token);
			mailer.sendMail({ from: `"Equuual"<${CONSTANTE.MAIL_USER}>`, to: customer.email, subject: "Réinitialiser votre mot de passe Equuual", html: data });
			req.flash("success", { message: "Vous aller recevoir par mail un lien pour réinitiliser votre mot de passe" });
			res.redirect("/web/auth/forgotpassword");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- forgotpassword" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/forgotpassword");
		}
	},
	resetPassword: async function (req, res, next) {
		let { token, password } = req.body;
		try {
			if (token == null || password == null) throw new WebException(40000);
			let decoded = jwt.verify(token, CONSTANTE["TOKEN_KEY"]);
			if (!decoded.customer_id) throw new WebException(40000);
			let customer = await customerDao.readOne({ where: { id: decoded.customer_id, reset_password_token: token } });
			if (customer == null) throw new WebException(40401);
			let newpass = blake.blake2bHex(CONSTANTE["START_SAL"] + password + CONSTANTE["END_SAL"]);
			customer = await customerDao.update(customer, { password: newpass, reset_password_token: null });
			res.redirect("/web/auth/login");
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + "- forgotpassword" });
			}
			req.flash("error", err);
			res.redirect("/web/auth/reset_password?token=" + token);
		}
	},
	logout: async function (req, res, next) {
		req.session.destroy;
		req.session.user = null;
		res.locals.user = null;
		res.redirect("/web/auth/login");
	},
};

module.exports = authController;
