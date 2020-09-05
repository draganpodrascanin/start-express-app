import crypto from 'crypto';

export default (num) => {
	return crypto.randomBytes(num).toString('hex');
};
