const knex = require('../../knex/knex');
const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle get request for user profile by id
exports.getUserProfile = async (req, res) => {
	let preferedGender = ['male', 'female'];
	let preferedSexualPreference = ['straight', 'gayLesbian', 'biSexual'];

	const user = req.user;

	// find user age with helper function
	const age = getAge(user.dob);

	// get prefered gender and sexual preference
	preferedGender = getPreferedGender(user.gender, user.sexualPreference);
	preferedSexualPreference = getPreferedSexualPreference(user.sexualPreference);
	// find all requested users and partners and concat into single array
	const requested = await knex('requests').select('partnerId').where({ userId: user.id })
	const partner = await knex('partners').select('partnerId').where({ userId: user.id })
	let exclude = [...requested, ...partner];
	exclude = exclude.map(users => users.partnerId)

  // find all other users within -+5 of user lonely level. Account for gender preference and sexual orientation
	const suggestion = await knex('users')
		.whereBetween('lonelyLevel', [user.lonelyLevel - 5, user.lonelyLevel + 5])
		.whereIn('gender', preferedGender)
		.whereIn('sexualPreference', preferedSexualPreference)
		.whereNotIn('id', exclude)
		.whereNot({ id: user.id })
		.limit(10);
  // the chosen profile by id 
  const userById = await knex('users').where({ id: req.params.id })
  // profile age
  const profileAge = getAge(userById[0].dob)

	// check if request is pending
	const pending = await knex('requests').where({
		userId: user.id,
		partnerId: req.params.id
	})

	// check if is partner
	const isPartner = await knex('partners').where({
		userId: user.id,
		partnerId: req.params.id
	})

	res.render('user', {
		pageTitle: 'userName',
		userCss: true,
		userProfiles: true,
		user,
		age,
    profileAge,
    suggestionCount: suggestion.length,
		userById: userById[0],
		pending: pending.length > 0,
    isPartner: isPartner.length > 0
	});
};
