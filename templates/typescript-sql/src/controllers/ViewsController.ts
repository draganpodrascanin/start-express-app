import { Request, Response, NextFunction } from 'express';

export default class ViewsController {
	// render homepage
	static home = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).render('home.pug');
	};

	//404 page
	static NotFound404View = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		res.status(200).render('404.pug');
	};
}
