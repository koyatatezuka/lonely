const knex = require('../../knex/knex');

const {
	getAge,
	getPreferedGender,
	getPreferedSexualPreference
} = require('../../util/helper');

// handle get request for partner
exports.getRequests = async (req, res) => {
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

	// find all requests
	const userRequests = await knex('requests')
		.join('users', { 'users.id': 'partnerId' })
		.where({ userId: user.id })
		.whereNot({ userId: user.id });


	res.render('user', {
		pageTitle: 'Lonely Requests',
		userCss: true,
		requests: true,
		user,
		age,
		userRequests,
		suggestionCount: suggestion.length
	});
};

// handle post request for partner request
exports.postPartnerRequest = async (req, res) => {
	if (req.body.requestType === 'partner') {
		const request = await knex('requests').insert({
			userId: req.user.id,
			partnerId: req.body.partnerId
		});
	} else if (req.body.requestType === 'unPartner') {
		const deletedPartner = await knex('partners')
			.where({
				userId: req.user.id,
				partnerId: req.body.partnerId
			})
			.orWhere({
				userId: req.body.partnerId,
				partnerId: req.user.id
			})
			.del();
	}

	res.redirect(`/user/byuser/${req.body.partnerId}`);
};

// handle post request request respone
exports.postRequestResponse = async (req, res) => {
	const user = req.user;

	// if response is accept insert new partner row
	if (req.body.response === 'accept') {
		const partner = await knex('partners').insert({
			userId: user.id,
			partnerId: req.body.partnerId
		});
	}
	// delete request after response
	const deletedRequest = await knex('requests')
		.where({
			userId: user.id,
			partnerId: req.body.partnerId
		})
		.orWhere({
			userId: req.body.partnerId,
			partnerId: user.id
		})
		.del();

	res.redirect('/user/requests');
};
