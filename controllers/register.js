const knex = require('../knex/knex');

const passport = require('passport');
const bcrypt = require('bcryptjs');

// handle get request for register page
exports.getRegister = (req, res) => {
	res.render('register', {
		pageTitle: 'Register',
		registerCss: true
	});
};

// handle post request post for register
exports.postRegister = async (req, res) => {
	const lonelyLevel =
		parseInt(req.body.question1) +
		parseInt(req.body.question2) +
		parseInt(req.body.question3) +
		parseInt(req.body.question4) +
		parseInt(req.body.question5) +
		parseInt(req.body.question6) +
		parseInt(req.body.question7) +
		parseInt(req.body.question8) +
		parseInt(req.body.question9) +
		parseInt(req.body.question10);

	const checkUser = await knex('users').where({ email: req.body.email });

	if (checkUser.length > 0) {
		return res.render('register', {
			pageTitle: 'Register',
			registerCss: true,
			emailExist: true
		});
	}

	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	firstName = firstName.charAt(0).toUpperCase() + firstName.substr(1);
	lastName = lastName.charAt(0).toUpperCase() + lastName.substr(1);

	const password = req.body.password;
	const saltRounds = 10;

	// hash password
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(password, saltRounds, function(err, hash) {
			knex('users')
				.insert({
					firstName,
					lastName,
					email: req.body.email,
					password: hash,
					city: req.body.city,
					state: req.body.state,
					gender: req.body.gender,
					sexualPreference: req.body.sexualPreference,
					dob: req.body.dob,
					image: req.body.image,
					likes: req.body.likes,
					dislikes: req.body.dislikes,
					hobbies: req.body.hobbies,
					lonelyLevel
				})
				.then(result => res.redirect('/log'))
				.catch(err => console.log(err));
		});
	});
};
