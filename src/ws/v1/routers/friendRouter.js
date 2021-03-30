const express = require("express");
const router = express.Router();

//CONTROLLER
const friendController = require("../controllers/friendController");

router.get("/", friendController.getFriends);
router.get("/search/:valueToSearch", friendController.searchFriends);
router.post("/", friendController.requestFriend);
router.delete("/:id", friendController.deleteFriend);

module.exports = router;
