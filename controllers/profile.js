const knex = require('../knex/knex');


// handle get request for profile
exports.getProfile = (req, res) => {

  const user = req.user

  let male = false, female = false;
  let straight = false, gayLesbian = false, biSexual = false;

  switch(user.gender) {
    case 'male':
    male = true;
    break;
    case 'female':
    female = true;
    break;
    default:
    break;
  }

  switch(user.sexualPreference) {
    case 'straight':
    straight = true;
    break;
    case 'gayLesbian':
    gayLesbian = true;
    break;
    case 'biSexual':
    biSexual = true;
    break;
    default:
    break;
  }

	res.render('profile', {
    pageTitle: 'Profile',
    profileCss: true,
    user,
    male,
    female,
    straight,
    gayLesbian,
    biSexual
	});
};

// handle post request for edit on profile
exports.postProfile = async (req, res) => {
  
  const updatedProfile = await knex('users')
  .where({
    email: req.user.email
  })
  .update({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city: req.body.city,
    state: req.body.state,
    gender: req.body.gender,
    sexualPreference: req.body.sexualPreference,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    hobbies: req.body.hobbies
  })

	res.redirect('/profile');
};

// handle post request for image upload
exports.postImage = async (req, res) => {
  const imgUrl = req.files[0].location

  const updatedProfileImage = await knex('users')
  .where({
    id: req.user.id
  })
  .update({
    image: imgUrl
  }) 

  res.redirect('/profile')
}
