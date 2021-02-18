const express = require("express");
const router = express.Router();

//CONTROLLER
const accountController = require("../controllers/accountController");

router.get("/", accountController.dispatchAccount);
router.get("/edit", accountController.dispatchEditAccount);
router.post("/", accountController.editAccount);

module.exports = router;
