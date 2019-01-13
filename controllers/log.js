const passport = require('passport');

// handle log get request
exports.getLog = (req, res) => {
	res.render('log', {
		pageTitle: 'Log',
		logCss: true
	});
};

// handle failed log in
exports.getFailedLogIn = (req, res) => {
	res.render('log', {
		pageTitle: 'Log',
		logCss: true,
		failedAttempt: true
	});
};

// handle post log in request
exports.postSignIn = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/log/failed'
});

// handle logout get request
exports.getLogOut = (req, res) => {
	req.logout();
	res.redirect('/log');
};
