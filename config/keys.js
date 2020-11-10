require('dotenv/config')

const dbPassword = process.env.MONGOURI

module.exports = {
	mongoURI: dbPassword
}
