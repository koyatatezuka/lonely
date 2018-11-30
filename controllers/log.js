// handle log get request
exports.getLog = (req, res) => {
  res.render('log', {
    pageTitle: 'Log',
    logCss: true,
  })
};

// handle logout get request
exports.getLogOut = (req, res) => {
  res.redirect('/log')
}