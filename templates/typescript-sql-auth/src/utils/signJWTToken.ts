import jwt from 'jsonwebtoken';

export default (id: string | number) => {
	return jwt.sign({ id, iat: Date.now() }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRES_IN!,
	});
};
