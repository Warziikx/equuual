const models = require("../../core/models");

//DAO
const customerDao = require("../../core/dao/customerDao");
const customerOriginDao = require("../../core/dao/customerOriginDao");

//UTILS
const logger = require("../../core/utils/logger");
const CONSTANTE = require("../../core/utils/constant");
const FILE_NAME = "providersAuthController";

//OTHER
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID == null ? CONSTANTE.FACEBOOK_LOGIN_CLIENT_ID_DEV : process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET == null ? CONSTANTE.FACEBOOK_LOGIN_CLIENT_SECRET_DEV : process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK_URL == null ? CONSTANTE.FACEBOOK_LOGIN_CALLBACK_DEV : process.env.FACEBOOK_CALLBACK_URL,
			profileFields: ["id", "name", "displayName", "emails"],
		},
		async function (accessToken, refreshToken, profile, done) {
			let user = await customerDao.readOne({
				where: { provider_id: profile.id },
				include: [
					{ model: models.customer_img, as: "customerImg" },
					{ model: models.customer_origin, as: "origin", where: { origin_name: "facebook" }, required: true },
				],
			});
			if (user == null) {
				let origin = await customerOriginDao.readOne({ where: { origin_name: "facebook" } });
				let customer = await customerDao.create({
					provider_id: profile.id,
					origin_id: origin.id,
					img_id: 1,
					displayName: profile.displayName,
					email: profile.emails[0].value,
				});
				let newCustomer = await customerDao.readOne({
					where: { provider_id: profile.id },
					include: [
						{ model: models.customer_img, as: "customerImg" },
						{ model: models.customer_origin, as: "origin", where: { origin_name: "facebook" }, required: true },
					],
				});
				done(null, newCustomer);
			} else {
				done(null, user);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CONSUMER_KEY == null ? CONSTANTE.GOOGLE_CONSUMER_KEY_DEV : process.env.GOOGLE_CONSUMER_KEY,
			clientSecret: process.env.GOOGLE_CONSUMER_SECRET == null ? CONSTANTE.GOOGLE_CONSUMER_SECRET_DEV : process.env.GOOGLE_CONSUMER_SECRET,
			callbackURL: process.env.GOOGLE_LOGIN_CALLBACK == null ? CONSTANTE.GOOGLE_LOGIN_CALLBACK_DEV : process.env.GOOGLE_LOGIN_CALLBACK,
		},
		async function (token, tokenSecret, profile, done) {
			let user = await customerDao.readOne({
				where: { provider_id: profile.id },
				include: [
					{ model: models.customer_img, as: "customerImg" },
					{ model: models.customer_origin, as: "origin", where: { origin_name: "google" }, required: true },
				],
			});
			if (user == null) {
				let origin = await customerOriginDao.readOne({ where: { origin_name: "google" } });
				let customer = await customerDao.create({ provider_id: profile.id, origin_id: origin.id, img_id: 1, displayName: profile.displayName, email: profile.emails[0].value });
				let newCustomer = await customerDao.readOne({
					where: { provider_id: profile.id },
					include: [
						{ model: models.customer_img, as: "customerImg" },
						{ model: models.customer_origin, as: "origin", where: { origin_name: "google" }, required: true },
					],
				});
				done(null, newCustomer);
			} else {
				done(null, user);
			}
		}
	)
);

const providersAuthController = {
	fbCallback: function (req, res, next) {
		req.session.user = req.user;
		res.locals.user = req.user;
		if (req.user.login == null || req.user.login == "") {
			res.redirect("/web/auth/defineLogin");
		} else {
			res.redirect("/web/group");
		}
	},
	googleCallback: function (req, res, next) {
		req.session.user = req.user;
		res.locals.user = req.user;
		if (req.user.login == null || req.user.login == "") {
			res.redirect("/web/auth/defineLogin");
		} else {
			res.redirect("/web/group");
		}
	},
};

module.exports = providersAuthController;
