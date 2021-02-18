const ERROR_CODE = require("./errorCode");

class coreException {
	constructor(code) {
		this.status = ERROR_CODE[code]["http"];
		this.message = ERROR_CODE[code]["message"];
		this.code = code;
	}
}

module.exports = coreException;
