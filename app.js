const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');

const knex = require('./knex/knex');
const { home, log, register, profile, user, post } = require('./routes/index');
const get404 = require('./controllers/error');

const app = express();
const PORT = process.env.PORT || 3000;

// hbs setup
app.engine(
	'hbs',
	handlebars({
		layoutsDir: path.join(__dirname, 'views/layouts/'),
		defaultLayout: 'main-layout',
		partialsDir: path.join(__dirname, 'views/partials'),
		extname: 'hbs'
	})
);
app.set('view engine', 'hbs');

// middleware setup
app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// // inject user data temp ---------------------
// app.use(async (req, res, next) => {
// 	try {
// 		const user = await knex('users').where({ id: 2 });

// 		req.user = user[0];

// 		next();
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

// routes
app.use('/', home);
app.use('/log', log);
app.use('/register', register);
app.use('/profile', profile);
app.use('/user', user);
app.use('/post', post);

// handle 404 error
app.use(get404);

// handle user sign in and intialize user
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	knex('users')
		.where({ id: id })
		.then(([user]) => {
			if (!user) {
				done(new Error('User not found! ' + id));
			}
			done(null, user);
		});
});

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async function(email, password, done) {
			try {
				let user = await knex('users').where({ email: email });

				if (user) user = user[0];

				if (!user) {
					return done(null, false, { message: 'Incorrect username/password' });
				}

				bcrypt.compare(password, user.password, function(err, res) {
					if (res) {
						return done(null, user);
					} else {
						return done(null, false, { message: 'Incorrect username/password' });
					}
				});
			} catch (err) {
				return done(err);
			}
		}
	)
);

// connect app to http server
app.listen(PORT, () => {
	console.log(`Connected to port: ${PORT}...`);
});
