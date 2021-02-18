const fs = require("fs");
const logdna = require("logdna");

process.env.TZ = "Europe/Amsterdam";

let infoStream = null;
let log = null;

if (process.env.NODE_ENV == "production") {
	log = logdna.setupDefaultLogger(process.env.LOGDNA_KEY, {});
} else {
	infoStream = fs.createWriteStream("logs/app.log", { flags: "a+" });
}

let logger = {
	info: (msg) => {
		if (msg instanceof Object) msg = JSON.stringify(msg);
		let message = "INFO || " + new Date().toString() + " : " + msg + "\n";
		if (process.env.NODE_ENV == "production") {
			log.info(message);
		} else {
			infoStream.write(message);
		}
	},
	exception: (msg) => {
		console.log(msg);
		if (msg instanceof Object) msg = JSON.stringify(msg);
		let message = "EXCEPTION || " + new Date().toString() + " : " + msg + "\n";
		if (process.env.NODE_ENV == "production") {
			log.error(message);
		} else {
			infoStream.write(message);
		}
	},
};

module.exports = logger;
