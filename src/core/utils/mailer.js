const CONSTANTE = require("./constant");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: CONSTANTE.MAIL_HOST,
	port: CONSTANTE.MAIL_PORT,
	secure: CONSTANTE.MAIL_TLS, // upgrade later with STARTTLS
	auth: {
		user: CONSTANTE.MAIL_USER,
		pass: CONSTANTE.MAIL_PASSWORD,
	},
});
// https://beefree.io/editor/?template=forgot-password
let mailer = {
	sendMail: (mailOptions) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
	},
};

module.exports = mailer;
