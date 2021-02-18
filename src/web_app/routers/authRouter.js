const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("../middleware/authMiddleware");

//CONTROLLER
const authController = require("../controllers/authController");

router.get("/login", authMiddleware.alreadyLoggedChecker(), authController.dispatchLogin);
router.post("/login", authController.login);

router.get("/register", authMiddleware.alreadyLoggedChecker(), authController.dispatchRegister);
router.post("/register", authController.register);

router.get("/forgotPassword", authMiddleware.alreadyLoggedChecker(), authController.dispatchForgotPassword);
router.post("/forgotPassword", authController.forgotpassword);

router.get("/reset_password", authController.dispatchResetPassword);
router.post("/resetPassword", authController.resetPassword);

router.get("/logout", authController.logout);

router.get("/defineLogin", authMiddleware.sessionChecker(), authController.dispatchDefineLogin);
router.post("/defineLogin", authMiddleware.sessionChecker(), authController.defineLogin);

module.exports = router;
