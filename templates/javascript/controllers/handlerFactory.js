/*
  You can use these handler fauctories
  to apstract standard api controllers
  (db mongo with mongoose)
*/

import CustomError from './../utils/CustomError';
import APIFeatures from './../utils/apiFeatures';

// delete one entry from database where id match to slug
//(authorization middleware most likely needed before this.)
export const deleteOne = (Model) => async (req, res, next) => {
	const doc = await Model.findByIdAndDelete(req.params.id);

	if (!doc) {
		throw new CustomError('No document found with that ID', 404);
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

//update one entry from database where id matches to slug
//(authorization middleware most likely needed before this.)
export const updateOne = (Model) => async (req, res, next) => {
	const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!doc) {
		throw new CustomError('No document found with that ID', 404);
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
//can pass second arg to get something to populate from db
export const getOne = (Model, popOptions) => async (req, res, next) => {
	let query = Model.findById(req.params.id);
	if (popOptions) query = query.populate(popOptions);
	const doc = await query;

	if (!doc) {
		throw new CustomError('No document found with that ID', 404);
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
export const getAll = (Model) => async (req, res, next) => {
	const features = new APIFeatures(Model.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const doc = await features.query;

	// SEND RESPONSE
	res.status(200).json({
		status: 'success',
		results: doc.length,
		data: {
			data: doc,
		},
	});
};
