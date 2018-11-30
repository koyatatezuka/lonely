const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');

const { home, log, register } = require('./routes/index');
const get404 = require('./controllers/error');
const knex = require('./knex/knex')

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', home);
app.use('/log', log);
app.use('/register', register)

// handle 404 error
app.use(get404);

// connect app to http server
app.listen(
	PORT, () => {
		console.log(`Connected to port: ${PORT}...`);
	}
);
