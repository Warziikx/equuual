const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("../middleware/authMiddleware");

//ROUTER
const authRouter = require("./authRouter");
const groupRouter = require("./groupRouter");
const friendRouter = require("./friendRouter");
const accountRouter = require("./accountRouter");

router.use("/auth", authRouter);
router.use("/group", authMiddleware.sessionChecker(), groupRouter);
router.use("/friend", authMiddleware.sessionChecker(), friendRouter);
router.use("/account", authMiddleware.sessionChecker(), accountRouter);

module.exports = router;
