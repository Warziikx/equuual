const express = require("express");
const router = express.Router();

//CONTROLLER
const friendController = require("../controllers/friendController");

router.get("/", friendController.dispatchFriends);
router.post("/", friendController.addFriend);
router.get("/:id/delete", friendController.deleteFriend);
router.get("/:id/validate", friendController.validateFriend);

module.exports = router;
