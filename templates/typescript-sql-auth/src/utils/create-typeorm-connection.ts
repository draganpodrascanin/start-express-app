import { createConnection, getConnectionOptions } from 'typeorm';

export default async () => {
	console.log(process.env.NODE_ENV);
	const conOptions = await getConnectionOptions(process.env.NODE_ENV);
	return await createConnection(conOptions);
};
