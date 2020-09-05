//render home page
export const homeController = (req, res, next) => {
	res.status(200).render('../views/home.pug');
};

//render login page
export const showLogin = (req, res, next) => {
	res.status(200).render('../views/login.pug');
};

//render signup page
export const showSignup = (req, res, next) => {
	res.status(200).render('../views/signup.pug');
};

//forgot password page
export const showForgotPassword = (req, res, next) => {
	res.status(200).render('../views/forgotPassword.pug');
};

export const showResetPassword = (req, res, next) => {
	res.status(200).render('../views/resetPassword.pug');
};

export const showProfile = (req, res, next) => {
	res.status(200).render('../views/profile.pug');
};

//404 view
export const NotFound404ViewController = (req, res, next) => {
	res.status(200).render('../views/404.pug');
};
