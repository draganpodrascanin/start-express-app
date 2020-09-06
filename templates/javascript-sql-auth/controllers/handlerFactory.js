/*
  You can use these HandlerFactory
  to apstract standard api controllers
  (db mongo with mongoose)
*/
import CustomError from '../utils/CustomError';

class HandlerFactory {
	// delete one entry from database where id match to slug
	deleteOne = (Model) => async (req, res, next) => {
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
	updateOne = (Model) => async (req, res, next) => {
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
	createOne = (Model) => async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	};

	//get one entry from database where id matches to slug
	//can pass second arg for filtering
	getOne = (Model, popOptions) => async (req, res, next) => {
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
	getAll = (Model, queryFilter) => async (req, res, next) => {
		const doc = Model.findAll(queryFilter);

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: {
				data: doc,
			},
		});
	};
}
export default new HandlerFactory();
