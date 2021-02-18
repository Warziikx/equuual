const express = require("express");
const router = express.Router();

//CONTROLLER
const friendController = require("../controllers/friendController");

/*router.get("/:id/group", customerController.getCustomerGroups);
router.get("/:id", customerController.getCustomer);*/
router.get("/", friendController.getFriends);
router.post("/", friendController.requestFriend);

//router.post("/", customerController.createCustomer);

module.exports = router;
