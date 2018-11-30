// handle get request for register page
exports.getRegister = (req, res) => {
  res.render('register', {
    pageTitle: 'Register',
    registerCss: true
  })
}