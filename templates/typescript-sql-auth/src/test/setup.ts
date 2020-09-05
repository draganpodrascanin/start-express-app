import TestConnection from './test-connection';
import 'express-async-errors';
let connection = new TestConnection();

// jest.useFakeTimers('modern');

beforeAll(async () => {
	try {
		await connection.create();
	} catch (err) {
		console.log(
			'falied creating a connection ===========================',
			err
		);
	}
});

beforeEach(async () => {
	try {
		await connection.clear();
	} catch (err) {
		console.log('failed clearing out the db ===========================', err);
	}
});

afterAll(async () => {
	try {
		connection.close();
	} catch (err) {
		console.log(
			'failed closing the connection ===========================',
			err
		);
	}
});
