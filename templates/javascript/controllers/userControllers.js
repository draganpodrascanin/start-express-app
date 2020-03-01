const User = require('./../models/User.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

/* 
    middleware, find user from slug
    and connect him to req obj
*/
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/*
    update user, can't be used for updating password
    only for email and name, you can modify it as you please
*/
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use proper way for updating password.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

//make current user inactive i.e. deleting him for all clients
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//get one user from slug
exports.getUser = factory.getOne(User);
//get all users can be filtered by query string
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
//update user that id matches the slug
exports.updateUser = factory.updateOne(User);

//delete user that matches the slug
exports.deleteUser = factory.deleteOne(User);
