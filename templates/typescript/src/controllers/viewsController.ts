import { Request, Response, NextFunction } from 'express';

class ViewController {
  public showIndex = (req: Request, res: Response) => {
    res.status(200).render('home.pug');
  };

  public showNotFound404 = (req: Request, res: Response) => {
    res.status(200).render('404.pug');
  };
}
export default new ViewController();
