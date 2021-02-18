const models = require("../../core/models");

//DAO
const groupDao = require("../../core/dao/groupDao");

//SERVICES
const groupServices = require("../../core/services/groupServices");
const spendServices = require("../../core/services/spendServices");
const statsServices = require("../../core/services/statsServices");

const FILE_NAME = "statsController";

const statsController = {
	dispatchStatsIndex: async function (req, res, next) {
		try {
			let { id } = req.params;
			let group = await groupDao.readOne({ where: { id: id } });
			if (group === null) throw new WebException(40402);

			let spent = await spendServices.getSpendWithGroupId(id);
			let data = await statsServices.getSpendCategoryRepartition(spent);
			res.render("group/stats/index", {
				data: data,
				success: req.flash("success"),
				err: req.flash("error"),
			});
		} catch (err) {
			if (!(err instanceof WebException) || !(err instanceof CoreException)) logger.exception({ err: err, debugMsg: "BO - " + FILE_NAME + " - reportdDebt" });
			req.flash("error", err);
			res.redirect(`/web/group/${id}`);
		}
	},
};

module.exports = statsController;
