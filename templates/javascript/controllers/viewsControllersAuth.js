//render home page
exports.homeController = (req, res, next) => {
  res.status(200).render('../views/home.pug');
};

//render login page
exports.showLogin = (req, res, next) => {
  res.status(200).render('../views/login.pug');
};

//render signup page
exports.showSignup = (req, res, next) => {
  res.status(200).render('../views/signup.pug');
};
