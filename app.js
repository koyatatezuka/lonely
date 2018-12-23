const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// inject user data temp ---------------------
app.use(async (req, res, next) => {
	try {
		const user = await knex('users').where({ id: 2 });

		req.user = user[0];

		next();
	} catch (err) {
		console.log(err);
	}
});

// routes
app.use('/', home);
app.use('/log', log);
app.use('/register', register);
app.use('/profile', profile);
app.use('/user', user);
app.use('/post', post);

// handle 404 error
app.use(get404);

// connect app to http server
app.listen(PORT, () => {
	console.log(`Connected to port: ${PORT}...`);
});
