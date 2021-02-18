const express = require("express");
const router = express.Router();

//ROUTER
const authRouter = require("./authRouter");
const accountRouter = require("./accountRouter");
const groupRouter = require("./groupRouter");
const friendRouter = require("./friendRouter");

//MIDDLEWARE
const authMiddleware = require("../middleware/authmiddleware");

router.use("/auth", authRouter);
router.use("/account", authMiddleware.jwtChecker(), accountRouter);
router.use("/group", authMiddleware.jwtChecker(), groupRouter);
router.use("/friend", authMiddleware.jwtChecker(), friendRouter);

module.exports = router;
