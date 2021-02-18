const express = require("express");
const router = express.Router();
const passport = require("passport");

//CONTROLLER
const providersAuthController = require("../controllers/providersAuthController");

/* FACEBOOK LOGIN */
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/web/auth/login" }), providersAuthController.fbCallback);

/* GOOGLE LOGIN */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/web/auth/login" }), providersAuthController.googleCallback);

module.exports = router;
