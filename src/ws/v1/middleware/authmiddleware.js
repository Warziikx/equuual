var jwt = require("jsonwebtoken");
const CONSTANTE = require("../../../core/utils/constant");

const middlware = {
	jwtChecker: function () {
		return function (req, res, next) {
			try {
				let decoded = jwt.verify(req.headers.token, CONSTANTE["TOKEN_KEY"]);
				if (decoded.customer_id) {
					req.session.customer_id = decoded.customer_id;
					next();
				} else {
					res.send({ error: "Invalid" });
				}
			} catch (err) {
				res.status(498);
				res.send(err);
			}
		};
	},
};

module.exports = middlware;
