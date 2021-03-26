const express = require("express");
const router = express.Router();

//CONTROLLER
const groupController = require("../controllers/groupController");

router.get("/", groupController.getGroups);
router.get("/:id", groupController.getGroup);
router.post("/", groupController.createGroup);
router.put("/:id", groupController.editGroup);
router.delete("/:id", groupController.deleteGroup);

//MEMBRE
router.get("/:id/member", groupController.listMembers);
router.post("/:id/member", groupController.inviteMember);

//DEPENSE
router.get("/:id/spend", groupController.getSpends);

//DETTE
router.get("/:id/debt", groupController.getDebts);

//ARCHIVE
router.get("/:id/archive", groupController.getArchives);
router.get("/:id/archive/:archiveId", groupController.getSpendsArchives);

//OPTIONS
router.get("/:id/option", groupController.getOptions);

module.exports = router;
