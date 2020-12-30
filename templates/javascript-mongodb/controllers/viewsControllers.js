//render home page
class ViewController {
	home = (req, res, next) => {
		res.status(200).render('home.pug');
	};

	NotFound404 = (req, res, next) => {
		res.status(404).render('404.pug');
	};
}

export default new ViewController();
