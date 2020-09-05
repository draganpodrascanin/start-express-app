import { Request, Response, NextFunction } from 'express';

class ViewsController {
	// render homepage
	public home = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).render('home.pug');
	};

	//render login page
	public showLogin = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).render('login.pug');
	};

	//render signup page
	public showSignup = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).render('signup.pug');
	};

	//forgot password page
	public showForgotPassword = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		res.status(200).render('forgotPassword.pug');
	};

	public showResetPassword = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		res.status(200).render('resetPassword.pug');
	};

	//404 page
	public NotFound404View = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		res.status(404).render('404.pug');
	};
}

export default new ViewsController();
