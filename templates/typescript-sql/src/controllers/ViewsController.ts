import { Request, Response, NextFunction } from 'express';

class ViewsController {
	// render homepage
	public home = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).render('home.pug');
	};

	//404 page
	public NotFound404View = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		res.status(200).render('404.pug');
	};
}
export default new ViewsController();
