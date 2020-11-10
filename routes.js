const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const fetch = require('node-fetch')
const path = require('path')
const crypto = require('crypto')

const multer = require('multer')
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.join(__dirname + '/public/uploads'))
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname)
	}
})
const upload = multer({ storage: storage })

//schemas
const User = require('./models/User')
const List = require('./models/List')

const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth')
const { Model } = require('mongoose')
const { Store } = require('express-session')

const mailer = require('./mail/mailer')

router.get('/', ensureAuthenticated, async (req, res) => {
	res.redirect('/dashboard')
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	const currentUser = req.user.email
	const lists = await List.find({ user: currentUser }).sort({ createdAt: 'desc' })
	res.render('dashboard', { user: req.user, lists: lists })
})

router.get('/list_register', ensureAuthenticated, async (req, res) => {
	const userLists = await List.find({ user: req.user.email })
	res.render('list_register', { user: req.user, userLists: userLists, cardFail: false, errorList: false })
})

router.get('/list_show/:id', async (req, res) => {
	const list = await List.findById(req.params.id)
	const userLists = await List.find({ user: list.user })
	const user = await User.findOne({ email: list.user })
	let editable = false

	try {
		const currentUser = req.user.email
		if (user.email === currentUser) {
			editable = true
		}
	} catch (error) {
		console.log(error)
	}

	res.render('list_show', { list: list, userLists: userLists, user: user, editable: editable })
})

router.get('/delete/:id', (req, res) => {
	List.deleteOne({ _id: req.params.id }, (err, _result) => {
		if (err) return res.send(500, err)
		res.redirect('/dashboard')
	})
})

router.get('/edit/:id', async (req, res) => {
	const list = await List.findById(req.params.id)
	const userLists = await List.find({ user: list.user })
	const user = await User.findOne({ email: list.user })
	res.render('list_edit', { list: list, userLists, user: user, cardFail: false, errorList: false, id: req.params.id })
})

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
	let cardsObj = []
	let cardFail = []
	let cardImages = []
	let scryfallFail = false
	let id = req.params.id

	//quando vem apenas um item ele vem em formato de string, então deve fazer um push
	//caso venham mais do que um ele vem como objeto, então o melhor é cardsObj receber tudo
	//pois um push deixaria um objeto dentro do outro
	if (typeof req.body.card === 'string') {
		cardsObj.push(req.body.card)
	} else {
		cardsObj = req.body.card
	}

	//pra cada carta busca a url da imagem na api do scryfall
	for (let card in cardsObj) {
		let cardItem = cardsObj[card]

		try {
			let dataAPI = await (await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardItem}`)).json()
			cardImages.push(dataAPI.image_uris.normal)
		} catch (error) {
			scryfallFail = true
			cardFail.push(cardItem)
		}
	}

	if (scryfallFail) {
		const userLists = await List.find({ user: req.user.email })

		const errorList = {
			title: req.body.title,
			quantity: req.body.quantity,
			card: req.body.card
		}

		res.render('list_edit', {
			user: req.user,
			userLists: userLists,
			cardFail: cardFail,
			errorList: errorList,
			id: req.params.id
		})
	} else {
		List.updateOne(
			{
				_id: id
			},
			{
				title: req.body.title,
				quantity: req.body.quantity,
				card: req.body.card,
				image: cardImages,
				user: req.user.email
			},
			(err, _result) => {
				if (err) return res.send(err)
				res.redirect('/dashboard')
			}
		)
	}
})

router.post('/list_register', ensureAuthenticated, async (req, res) => {
	let cardsObj = []
	let cardFail = []
	let cardImages = []
	let scryfallFail = false

	//quando vem apenas um item ele vem em formato de string, então deve fazer um push
	//caso venham mais do que um ele vem como objeto, então o melhor é cardsObj receber tudo
	//pois um push deixaria um objeto dentro do outro
	if (typeof req.body.card === 'string') {
		cardsObj.push(req.body.card)
	} else {
		cardsObj = req.body.card
	}

	//pra cada carta busca a url da imagem na api do scryfall
	for (let card in cardsObj) {
		let cardItem = cardsObj[card]

		try {
			let dataAPI = await (await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardItem}`)).json()
			cardImages.push(dataAPI.image_uris.normal)
		} catch (error) {
			scryfallFail = true
			cardFail.push(cardItem)
		}
	}

	if (scryfallFail) {
		const userLists = await List.find({ user: req.user.email })

		const errorList = {
			title: req.body.title,
			quantity: req.body.quantity,
			card: req.body.card
		}

		console.log(typeof errorList)
		console.log(typeof cardFail)

		res.render('list_register', { user: req.user, userLists: userLists, cardFail: cardFail, errorList: errorList })
	} else {
		let newList = new List({
			title: req.body.title,
			quantity: req.body.quantity,
			card: req.body.card,
			image: cardImages,
			user: req.user.email
		})
		try {
			await newList.save()
			res.redirect('dashboard')
		} catch (error) {
			console.error(error)
		}
	}
})

// USER
router.get('/register', (_req, res) => {
	const errors = ''
	res.render('register', { errors: errors })
})

router.post('/register', upload.single('userImg'), (req, res) => {
	const { name, email, password, password2 } = req.body
	const resetPasswordToken = undefined
	const resetPasswordExpires = undefined
	let filename = null
	let errors = []

	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Preencha todos os campos' })
	}

	if (password != password2) {
		errors.push({ msg: 'Senhas não são iguais' })
	}

	if (password.length < 6) {
		errors.push({ msg: 'A senha tem que ter pelo menos 6 caracteres' })
	}

	if (req.file) {
		filename = req.file.filename
	} else {
		filename = 'profile-picplaceholder.png'
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2
		})
	} else {
		User.findOne({ email: email }).then((user) => {
			if (user) {
				errors.push({ msg: 'Email already exists' })
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				})
			} else {
				const newUser = new User({
					name,
					email,
					password,
					filename,
					resetPasswordToken,
					resetPasswordExpires
				})

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err
						newUser.password = hash
						newUser
							.save()
							.then((user) => {
								mailer.registrado(name, email)
								req.flash('success_msg', 'You are now registered and can log in')
								res.redirect('/login')
							})
							.catch((err) => console.log(err))
					})
				})
			}
		})
	}
})

router.get('/login', forwardAuthenticated, (req, res) => {
	res.render('login', {
		message: req.flash('error')
	})
})

// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		badRequestMessage: 'Por favor preencha todos os campos',
		failureFlash: true
	})(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success_msg', 'You are logged out')
	res.redirect('/login')
})

//Esqueceu senha
router.get('/forgot', (req, res) => {
	res.render('forgot', { message: req.flash('msg') })
})

router.post('/forgot', async (req, res) => {
	let token = crypto.randomBytes(16)
	token = token.toString('hex')

	await User.findOne({ email: req.body.email }).then((user) => {
		if (!user) {
			req.flash('msg', 'não existe conta reigstrada com esse email')
		} else {
			user.resetPasswordToken = token
			user.resetPasswordExpires = Date.now() + 3600000

			user.save()

			req.flash('msg', 'link para redefinir a senha foi enviado ao seu email')
			mailer.esqueceu(req.body.email, token)
		}
	})

	res.render('forgot', { message: req.flash('msg') })
})

router.get('/reset/:token', async (req, res) => {
	await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(
		err,
		user
	) {
		if (!user) {
			req.flash('msg', 'Token inválido ou expirado.')
			return res.redirect('/forgot')
		}
	})

	res.render('reset', {
		user: req.user,
		message: req.flash('msg')
	})
})

router.post('/reset/:token', async (req, res) => {
	await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(
		err,
		user
	) {
		if (!user) {
			req.flash('msg', 'Token inválido ou expirado.')
			return res.redirect('/forgot')
		} else {
			user.password = req.body.password

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) => {
					if (err) throw err
					user.password = hash

					user.resetPasswordToken = undefined
					user.resetPasswordExpires = undefined

					user
						.save()
						.then((user) => {
							mailer.senhaAlterada(name, email)
							req.flash('success_msg', 'You are now registered and can log in')
							res.redirect('/login')
						})
						.catch((err) => console.log(err))
				})
			})

			return res.redirect('/')
		}
	})
})

module.exports = router
