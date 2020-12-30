import signToken from './signToken';
/*
  apstracted send JWT and response
  sends JWT as cookie HTTP only
  for production uncomment "secure" below,
  it's for HTTPS
  example of use - createSendToken(newUser, 201, req, res);
*/

export default (user, statusCode, req, res) => {
	const token = signToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		// secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
	});

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};
