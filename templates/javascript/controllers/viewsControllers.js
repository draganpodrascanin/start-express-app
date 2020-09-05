//render home page
exports.homeController = (req, res, next) => {
  res.status(200).render('../views/home.pug');
};

exports.NotFound404Controller = (req, res, next) => {
  res.status(404).render('../views/404.pug');
};
