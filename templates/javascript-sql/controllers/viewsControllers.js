//render home page
export const homeController = (req, res, next) => {
	res.status(200).render('../views/home.pug');
};

export const NotFound404Controller = (req, res, next) => {
	res.status(404).render('../views/404.pug');
};
