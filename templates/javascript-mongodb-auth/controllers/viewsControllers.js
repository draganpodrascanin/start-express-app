class ViewController {
	//render home page
	home = (req, res, next) => {
		res.status(200).render('home.pug');
	};

	//render login page
	showLogin = (req, res, next) => {
		res.status(200).render('login.pug');
	};

	//render signup page
	showSignup = (req, res, next) => {
		res.status(200).render('signup.pug');
	};

	//forgot password page
	showForgotPassword = (req, res, next) => {
		res.status(200).render('forgotPassword.pug');
	};

	showResetPassword = (req, res, next) => {
		res.status(200).render('resetPassword.pug');
	};

	showProfile = (req, res, next) => {
		res.status(200).render('profile.pug');
	};

	//404 view
	NotFound404View = (req, res, next) => {
		res.status(200).render('404.pug');
	};
}

export default new ViewController();
