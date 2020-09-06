import { getConnection } from 'typeorm';

export default () => {
	return getConnection(process.env.NODE_ENV);
};
