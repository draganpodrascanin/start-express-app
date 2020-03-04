//render home page
exports.homeController = (req, res, next) => {
  res.status(200).render('../views/home.pug');
};
