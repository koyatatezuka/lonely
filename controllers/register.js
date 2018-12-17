const knex = require('../knex/knex')

// handle get request for register page
exports.getRegister = (req, res) => {
  res.render('register', {
    pageTitle: 'Register',
    registerCss: true
  })
}

// handle post request post for register 
exports.postRegister = (req, res) => {

  const lonelyLevel = parseInt(req.body.question1) + parseInt(req.body.question2) + parseInt(req.body.question3) + parseInt(req.body.question4) + parseInt(req.body.question5) + parseInt(req.body.question6) + parseInt(req.body.question7) + parseInt(req.body.question8) + parseInt(req.body.question9) + parseInt(req.body.question10)

  knex('users')
  .insert({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city,
    state: req.body.state,
    gender: req.body.gender,
    sexualPreference: req.body.sexualPreference,
    dob: req.body.dob,
    image: req.body.image,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    hobbies: req.body.hobbies,
    lonelyLevel
  })
  .then(result => res.redirect('/log'))
  .catch(err => console.log(err))
}