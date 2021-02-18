var ERROR_CODE = require("./errorCode");

class WebException {
	constructor(code, exception = null) {
		this.status = code;
		this.message = ERROR_CODE[code]["message"];
		this.exception = ERROR_CODE[code]["exception"] + (exception != null ? exception : "");
	}
}

module.exports = WebException;
