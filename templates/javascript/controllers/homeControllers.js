// const catchAsync = require('../util/catchAsync');

exports.getHomeController = (req, res, next) => {
  res.status(200).render('../views/home.pug');
};
