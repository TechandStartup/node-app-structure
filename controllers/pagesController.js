// GET /
exports.home = (req, res) => {
  res.render('pages/home', { title: 'Node App Structure' });
};

// GET /about
exports.about = (req, res) => {
  res.render('pages/about', { title: 'About' });
};