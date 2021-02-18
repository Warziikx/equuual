//DAO
const groupDao = require("../../core/dao/groupDao");
const groupMemberDao = require("../../core/dao/groupMemberDao");

const authMiddleware = {
	sessionChecker: function () {
		return function (req, res, next) {
			if (req.session.user) {
				next();
			} else {
				res.redirect("/web/auth/login");
			}
		};
	},
	alreadyLoggedChecker: function () {
		return function (req, res, next) {
			if (!req.session.user) {
				next();
			} else {
				res.redirect("/web/group");
			}
		};
	},
	isGroupMember: function () {
		return (req, res, next) => {
			let { id } = req.params;
			groupDao.readOne({ where: { id: id } }).then((group) => {
				if (group.creator_id == req.session.user.id) {
					next();
				} else {
					groupMemberDao.readOne({ where: { id_group: id, id_customer: req.session.user.id } }).then((groupMember) => {
						if (groupMember != null) {
							next();
						} else {
							res.redirect("/web/group");
						}
					});
				}
			});
		};
	},
};

module.exports = authMiddleware;
