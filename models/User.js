//FILENAME : User.js

const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	filename: {
		type: String
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

// export model user with UserSchema
module.exports = mongoose.model('User', UserSchema)
