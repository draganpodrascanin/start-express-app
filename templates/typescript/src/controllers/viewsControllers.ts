import { Request, Response, NextFunction } from 'express';

export const showIndexController = (req: Request, res: Response) => {
	res.status(200).render('home.pug');
};

export const showNotFound404Controller = (req: Request, res: Response) => {
	res.status(200).render('404.pug');
};
