const express = require("express");
const router = express.Router();

//CONTROLLER
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh", authController.refresh);

router.post("/login/facebook", authController.loginFacebook);

router.post("/defineLogin", authController.defineLogin);

router.post("/forgotPassword", authController.forgotpassword); //

router.get("/images", authController.getAllImages);

module.exports = router;
