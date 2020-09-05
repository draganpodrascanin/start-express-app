import AppError from '../utils/AppError';

// delete one entry from database where id match to slug
//(authorization middleware most likely needed before this.)
export const deleteOne = (Model) => async (req, res, next) => {
	const doc = await Model.destroy({ where: { id: req.params.id } });

	if (!doc) {
		throw new AppError('No document found with that ID', 404);
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

//update one entry from database where id matches to slug
//(authorization middleware most likely needed before this.)
export const updateOne = (Model) => async (req, res, next) => {
	const doc = await Model.update(req.body, { where: { id: req.params.id } });

	if (!doc) {
		throw new AppError('No document found with that ID', 404);
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
};

//create one new entry to database
//(might want auth middleware before this)
export const createOne = (Model) => async (req, res, next) => {
	const doc = await Model.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
};

//get one entry from database where id matches to slug
//can pass second arg to set attributes
export const getOne = (Model, attr) => async (req, res, next) => {
	let query = Model.find({ where: { id: req.params.id } });
	if (attr) Model.find({ attributes: [...attr], where: { id: req.params.id } });
	const doc = await query;

	if (!doc) {
		throw new AppError('No document found with that ID', 404);
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
};

//get all entries from db
//can be filtered, sorted, limited and paginated with query string
export const getAll = (Model, filter = {}) => async (req, res, next) => {
	const features = Model.findAll(filter);

	const doc = await features;

	// SEND RESPONSE
	res.status(200).json({
		status: 'success',
		results: doc.length,
		data: {
			data: doc,
		},
	});
};
