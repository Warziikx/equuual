const models = require("../../../core/models");

//DAO
const customerDao = require("../../../core/dao/customerDao");
const deviceDao = require("../../../core/dao/deviceDao");
const customerOriginDao = require("../../../core/dao/customerOriginDao");
const customerImgDao = require("../../../core/dao/customerImgDao");

//UTILS
const CoreException = require("../../../core/utils/coreException");
const WsException = require("../utils/wsException");
const logger = require("../../../core/utils/logger");
const CONSTANTE = require("../../../core/utils/constant");
const FILE_NAME = "authController";

//OTHER
const mailer = require("../../../core/utils/mailer");
const blake = require("blakejs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { readdirSync } = require("fs");

const authController = {
	login: async function (req, res, next) {
		try {
			let { login, password, udid } = req.body;
			if (login == null || password == null || udid == null) throw new WsException(40000);
			let newpass = blake.blake2bHex(CONSTANTE["START_SAL"] + password + CONSTANTE["END_SAL"]);
			let customer = await customerDao.readOne({ where: { login: login, password: newpass } });
			if (customer == null) throw new WsException(40401);
			let device = await deviceDao.readOne({ where: { udid: udid } });
			if (device) {
				device = await deviceDao.update(device, { customer_id: customer.id });
			} else {
				refreshKey = crypto.randomBytes(16).toString("hex");
				device = await deviceDao.create({ customer_id: customer.id, udid: udid, refreshKey: refreshKey });
			}
			let token = jwt.sign(
				{
					customer_id: customer.id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			let refreshToken = jwt.sign(
				{
					customer_id: customer.id,
					refreshKey: device.refreshKey,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			res.send({ token: token, refreshToken: refreshToken });
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - login" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	loginFacebook: async function (req, res, next) {
		try {
			let { userId, name, email, udid } = req.body;
			if (userId == null || name == null || email == null || udid == null) throw new WsException(40000);
			let customer = await customerDao.readOne({
				where: { provider_id: userId },
				include: [
					{ model: models.customer_img, as: "image" },
					{ model: models.customer_origin, as: "origin", where: { origin_name: "facebook" }, required: true },
				],
			});
			if (customer == null) {
				let origin = await customerOriginDao.readOne({ where: { origin_name: "facebook" } });
				let customer = await customerDao.create({
					provider_id: userId,
					origin_id: origin.id,
					img_id: 1,
					displayName: name,
					email: email,
				});
				//Envoyer une erreur car l'utilisateur doit définir un login
				throw new WsException(30300);
			}
			let device = await deviceDao.readOne({ where: { udid: udid } });
			if (device) device = await deviceDao.update(device, { customer_id: customer.id });
			else {
				refreshKey = crypto.randomBytes(16).toString("hex");
				device = await deviceDao.create({ customer_id: customer.id, udid: udid, refreshKey: refreshKey });
			}
			let token = jwt.sign(
				{
					customer_id: customer.id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			let refreshToken = jwt.sign(
				{
					customer_id: customer.id,
					refreshKey: device.refreshKey,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			res.send({ token: token, refreshToken: refreshToken });
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - loginFacebook" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	defineLogin: async function (req, res, next) {
		try {
			let { userId, login, udid } = req.body;
			if (userId == null || login == null || udid == null) throw new WsException(40000);
			let customer = await customerDao.readOne({
				where: { provider_id: userId },
				include: [
					{ model: models.customer_img, as: "image" },
					{ model: models.customer_origin, as: "origin", where: { origin_name: "facebook" }, required: true },
				],
			});
			customer = await customerDao.update(customer, { login: login });
			customer = await customerDao.readOne({ where: { id: customer.id }, include: [{ model: models.customer_img, as: "image" }] });

			let device = await deviceDao.readOne({ where: { udid: udid } });
			if (device) device = await deviceDao.update(device, { customer_id: customer.id });
			else {
				refreshKey = crypto.randomBytes(16).toString("hex");
				device = await deviceDao.create({ customer_id: customer.id, udid: udid, refreshKey: refreshKey });
			}
			let token = jwt.sign(
				{
					customer_id: customer.id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			let refreshToken = jwt.sign(
				{
					customer_id: customer.id,
					refreshKey: device.refreshKey,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			res.send({ token: token, refreshToken: refreshToken });
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - loginFacebook" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	register: async function (req, res, next) {
		try {
			let { login, password, email, imageId, udid } = req.body;
			if (login == null || password == null) throw new WsException(40000);
			let newpass = blake.blake2bHex(CONSTANTE["START_SAL"] + password + CONSTANTE["END_SAL"]);
			let customer = await customerDao.readOne({ where: { login: login } });
			if (customer) throw new WsException(40901);
			customer = await customerDao.create({ login: login, password: newpass, email: email, img_id: imageId });
			let device = await deviceDao.readOne({ where: { udid: udid } });
			if (device) device = await deviceDao.update(device, { customer_id: customer.id });
			else {
				refreshKey = crypto.randomBytes(16).toString("hex");
				device = await deviceDao.create({ customer_id: customer.id, udid: udid, refreshKey: refreshKey });
			}
			let token = jwt.sign(
				{
					customer_id: customer.id,
					exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			let refreshToken = jwt.sign(
				{
					customer_id: customer.id,
					refreshKey: device.refreshKey,
				},
				CONSTANTE["TOKEN_KEY"]
			);
			res.send({ token: token, refreshToken: refreshToken });
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - register" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
			throw err;
		}
	},
	refresh: async function (req, res, next) {
		try {
			//Vérification des paramètres
			let { refreshToken } = req.body;
			if (refreshToken == null) throw new WsException(40000);

			//Décodage du token
			let decoded = jwt.verify(refreshToken, CONSTANTE["TOKEN_KEY"]);
			if (decoded.refreshKey === null && decoded.identifiant === null) throw new WsException(40000);
			//Vérification identifiant unique
			let result = await deviceDao.readOne({
				where: {
					refreshKey: decoded.refreshKey,
				},
				include: [{ model: models.customer, as: "customer", where: { id: decoded.customer_id } }],
			});
			if (result === null) throw new WsException(40101);
			let token = jwt.sign({ customer_id: result.customer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, CONSTANTE["TOKEN_KEY"]);
			res.send({ token: token });
		} catch (err) {
			if (!(err instanceof WsException) || !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + "- refresh" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	getAllImages: async function (req, res, next) {
		try {
			let customerImg = await customerImgDao.read({});
			res.send(customerImg);
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getAllImages" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
	forgotpassword: async function (req, res, next) {
		try {
			let { email } = req.body;
			if (email == null) throw new WsException(40000);
			let customer = await customerDao.readOne({ where: { email: email } });
			if (customer == null) throw new WsException(40401);
			mailer.sendMail({ from: CONSTANTE.MAIL_USER, to: customer.email, subject: "Sending Email using Node.js", text: "That was easy!" });
			res.send({ data: "ok" });
		} catch (err) {
			if (!(err instanceof WsException) && !(err instanceof CoreException)) {
				logger.exception({ err: err, debugMsg: FILE_NAME + " - getAllImages" });
			}
			res.status(err.status);
			delete err.status;
			res.send(err);
		}
	},
};

module.exports = authController;
