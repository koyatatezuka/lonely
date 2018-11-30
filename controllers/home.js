// handle root home get request
exports.getHome = (req, res) => {
  const isSignIn = true;

  if (!isSignIn) return res.redirect('/log');

  res.render('home', {
    pageTitle: 'Home',
    homeCss: true,
  })
}