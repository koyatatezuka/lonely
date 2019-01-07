const knex = require('../../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle user search get request
exports.postSearch = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];

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

	// split the search params into array of RegExp
	const searchArray = (req.body.search).split(' ').map(el => el.charAt(0).toUpperCase() + el.substr(1))
	// find all users that match search params
	const searchUsers = await knex('users')
		.whereIn('firstName', searchArray)
		.orWhereIn('lastName', searchArray)

	console.log(searchUsers)

	res.render('user', {
		pageTitle: 'Search',
		userCss: true,
		search: true,
		user,
		age,
		searchUsers,
    searchParams: req.body.search,
		suggestionCount: suggestion.length,
		requestCount: partnerRequest.length
	});
};
