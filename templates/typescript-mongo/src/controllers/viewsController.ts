import { Request, Response, NextFunction } from 'express';

//render home page
export const homeController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).render('home.pug');
};

//render login page
export const showLogin = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).render('login.pug');
};

//render signup page
export const showSignup = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).render('signup.pug');
};

//forgot password page
export const showForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).render('forgotPassword.pug');
};

export const showResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).render('resetPassword.pug');
};

export const showProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).render('profile.pug');
};

//404 view
export const NotFound404ViewController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).render('404.pug');
};
