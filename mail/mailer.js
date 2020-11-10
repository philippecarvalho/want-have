require('dotenv/config')
const nodemailer = require('nodemailer')
const siteURL = process.env.SITE_URL

module.exports = {
	registrado: async function(name, email) {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.umbler.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER, // generated ethereal user
				pass: process.env.MAIL_PASS // generated ethereal password
			}
		})

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Want/Have" <no-reply@phcarvalho.com.br>', // sender address
			to: email, // list of receivers
			subject: 'Bem vindo!', // Subject line
			text: 'Olá, ' + name + '! você foi registrado com sucesso no Want/Have', // plain text body
			// html body
			html:
				'<p style="font-size:16px">Olá ' +
				name +
				' você foi registrado com sucesso no <a href="' +
				siteURL +
				'">Want/Have</a></p>'
		})

		console.log('Message sent: %s', info.messageId)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	},

	esqueceu: async function(email, token) {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.umbler.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER, // generated ethereal user
				pass: process.env.MAIL_PASS // generated ethereal password
			}
		})

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Want/Have" <no-reply@phcarvalho.com.br>', // sender address
			to: email, // list of receivers
			subject: 'Redefinir senha', // Subject line
			text: 'Olá, alguém solicitou que sua senha fosse redefinida, se não foi você apenas ignore esse email', // plain text body
			// html body
			html:
				'<p style="font-size:16px">Olá, alguém solicitou que sua senha fosse redefinida, se não foi você apenas ignore esse email.<br> caso queira redefinir a senha, clique link abaixo:</p><br>' +
				siteURL +
				'/reset/' +
				token
		})

		console.log('Message sent: %s', info.messageId)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	},

	senhaAlterada: async function(name, email) {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.umbler.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER, // generated ethereal user
				pass: process.env.MAIL_PASS // generated ethereal password
			}
		})

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Want/Have" <no-reply@phcarvalho.com.br>', // sender address
			to: email, // list of receivers
			subject: 'Senha alterada', // Subject line
			text: 'Olá, ' + name + '! sua senha foi alterada com sucesso', // plain text body
			// html body
			html:
				'<p style="font-size:16px">Olá ' +
				name +
				' sua senha foi alterada com sucesso<br> <a href="' +
				siteURL +
				'">Want/Have</a></p>'
		})

		console.log('Message sent: %s', info.messageId)
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}
}
