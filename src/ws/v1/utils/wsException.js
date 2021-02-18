var ERROR_CODE = require("./errorCode");

class WsException {
	constructor(code, exception = null) {
		this.status = ERROR_CODE[code]["http"];
		this.code = code;
		this.message = ERROR_CODE[code]["message"];
		this.exception = ERROR_CODE[code]["exception"] + (exception != null ? exception : "");
	}
}

module.exports = WsException;
