const knex = require('../../knex/knex');

const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle get request for partner
exports.getPartners = async (req, res) => {
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
		.where({ userId: user.id });
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

	// find all partners
	const userPartners = await knex('partners')
		.join('users', { 'users.id': 'partnerId' })
    .where({ userId: user.id })
    .orWhere({ partnerId: user.id })
    
	res.render('user', {
		pageTitle: 'Lonely Partners',
		userCss: true,
		partners: true,
		user,
    age,
    userPartners,
		suggestionCount: suggestion.length
	});
};
