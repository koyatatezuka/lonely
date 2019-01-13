const knex = require('../../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle user suggestion get request
exports.getSuggestions = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];

	if (!req.user) return res.redirect('/log');

	const user = req.user;

	// find user age with helper function
	const age = getAge(user.dob);

	// get prefered gender and sexual preference
	preferedGender = getPreferedGender(user.gender, user.sexualPreference);
	preferedSexualPreference = getPreferedSexualPreference(user.sexualPreference);

	// find all requested users and partners and concat into single array
	const requested = await knex('requests')
		.select('partnerId')
		.where({ userId: user.id })
		
	const partner = await knex('partners')
		.select('partnerId')
		.where({ userId: user.id });
	let exclude = [...requested, ...partner];
	exclude = exclude.map(users => users.partnerId);

	// find all other users within -+5 of user lonely level. Account for gender preference and sexual orientation
	const suggestion = await knex('users')
		.whereBetween('lonelyLevel', [user.lonelyLevel - 5, user.lonelyLevel + 5])
		.whereIn('gender', preferedGender)
		.whereIn('sexualPreference', preferedSexualPreference)
		.whereNotIn('id', exclude)
		.whereNot({ id: user.id })
		.limit(10);

	// find all request for partner by id
	const partnerRequest = await knex('requests').where({ partnerId: user.id });

	res.render('user', {
		pageTitle: 'Suggestions',
		userCss: true,
		suggestions: true,
		user,
		age,
		suggestion,
		suggestionCount: suggestion.length,
		requestCount: partnerRequest.length
	});
};
