const express = require("express");
const router = express.Router();

//CONTROLLER
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAccount);

router.post("/edit", accountController.editAccount);

module.exports = router;
