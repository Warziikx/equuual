const express = require("express");
const router = express.Router();

//CONTROLLER
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAccount);

//router.post("/", customerController.createCustomer);

module.exports = router;
