import { getConnection, getConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
dotenv.config({ path: 'config.env' });

const env = process.env.NODE_ENV;
if (!env) {
	console.log('CRITICAL ERROR SET YOUR ENV VARIABLES, EXITING APP NOW');
	process.exit(1);
}
// console.log('NODE_ENV =', env);

class TestConnection {
	//create a connection to test db
	public async create() {
		try {
			const opt = await getConnectionOptions(env);
			await createConnection(opt);
		} catch (err) {
			console.log("can't connect to db, ERROR = ", err);
		}
	}

	//clear everything from db
	public async clear() {
		const connection = getConnection(env);
		const entities = connection.entityMetadatas;

		entities.forEach(async (entity) => {
			const repository = connection.getRepository(entity.name);
			try {
				await repository.query(`DELETE FROM ${entity.tableName}`);
			} catch (err) {
				console.log('failed to delete everything in db ======', err);
			}
		});
	}

	//close connection
	public async close() {
		try {
			await getConnection(env).close();
		} catch (err) {
			console.log('failed to close db =====', err);
		}
	}
}

export default TestConnection;
