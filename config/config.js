require('dotenv').config();

module.exports = {
		"url" : process.env.POSTGRES_URL,
		// "username": "kwrykdkkqvbltv",
		// "password": "250dea0c69b58de1a827b1b472a022b5dbe5f00792dce1941e4e59d69c8a7e32",
		// "database": "df4f1frbdc1fhk",
		// "host": "ec2-34-251-118-151.eu-west-1.compute.amazonaws.com",
		"dialect": "postgres",
		"dialectOptions": {
			"ssl": {
				"rejectUnauthorized": false
			}
		},
		"timezone": "+02:00"
}
