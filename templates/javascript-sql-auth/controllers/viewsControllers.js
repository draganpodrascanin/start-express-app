class ViewController {
	//render home page
	home = (req, res, next) => {
		res.status(200).render('../views/home.pug');
	};

	//render login page
	showLogin = (req, res, next) => {
		res.status(200).render('../views/login.pug');
	};

	//render signup page
	showSignup = (req, res, next) => {
		res.status(200).render('../views/signup.pug');
	};

	//forgot password page
	showForgotPassword = (req, res, next) => {
		res.status(200).render('../views/forgotPassword.pug');
	};

	showResetPassword = (req, res, next) => {
		res.status(200).render('../views/resetPassword.pug');
	};

	showProfile = (req, res, next) => {
		res.status(200).render('../views/profile.pug');
	};

	//404 view
	NotFound404 = (req, res, next) => {
		res.status(200).render('../views/404.pug');
	};
}

export default new ViewController();
