const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("../middleware/authMiddleware");

//CONTROLLER
const groupController = require("../controllers/groupController");
const spendController = require("../controllers/spendController");
const statsController = require("../controllers/statsController");

router.get("/", groupController.dispatchGroups);
router.post("/", groupController.newGroup);

router.get("/:id", authMiddleware.isGroupMember(), groupController.dispatchGroup);
router.get("/:id/archive/:archiveId", authMiddleware.isGroupMember(), groupController.dispatchGroup);
router.post("/:id", authMiddleware.isGroupMember(), authMiddleware.isGroupMember(), groupController.editGroup);
router.get("/:id/delete", authMiddleware.isGroupMember(), groupController.deleteGroup);

router.get("/:id/member/:memberId/remove", authMiddleware.isGroupMember(), groupController.removeMember);
router.post("/:id/member", authMiddleware.isGroupMember(), groupController.addMember);

/* GROUP SPEND */
router.get("/:id/spend/new", authMiddleware.isGroupMember(), spendController.dispatchNewSpend);
router.post("/:id/spend", authMiddleware.isGroupMember(), spendController.newSpend);
router.get("/:id/spend/:spendId", authMiddleware.isGroupMember(), spendController.dispatchSpend);
router.get("/:id/spend/:spendId/edit", authMiddleware.isGroupMember(), spendController.dispatchEditSpend);
router.post("/:id/spend/:spendId", authMiddleware.isGroupMember(), spendController.editSpend);
router.get("/:id/spend/:spendId/delete", authMiddleware.isGroupMember(), spendController.deleteSpend);

router.post("/:id/refund", authMiddleware.isGroupMember(), spendController.refundDebt);
router.post("/:id/report", authMiddleware.isGroupMember(), spendController.reportdDebt);

/* GROUP STATS */
router.get("/:id/stats", authMiddleware.isGroupMember(), statsController.dispatchStatsIndex);

module.exports = router;
