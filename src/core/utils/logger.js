const fs = require("fs");

process.env.TZ = "Europe/Amsterdam";

let infoStream = null;

//infoStream = fs.createWriteStream("logs/app.log", { flags: "a+" });

let logger = {
	info: (msg) => {
		if (msg instanceof Object) msg = JSON.stringify(msg);
		let message = "INFO || " + new Date().toString() + " : " + msg + "\n";
		//infoStream.write(message);
	},
	exception: (msg) => {
		console.log(msg);
		if (msg instanceof Object) msg = JSON.stringify(msg);
		let message = "EXCEPTION || " + new Date().toString() + " : " + msg + "\n";
		//infoStream.write(message);
	},
};

module.exports = logger;
