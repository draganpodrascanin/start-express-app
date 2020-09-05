import { getConnection } from 'typeorm';
import { User } from '../../entity/User';
import app from '../../app';
import request from 'supertest';

//SIGN UP POST /api/v1/users returns 201 expected email,firstName,lastName,password,passwordConfirm

it('returns error status 400 if password and passwordConfirm dont match', async () => {
	await request(app)
		.post('/api/v1/users')
		.send({
			email: 'valid@email.com',
			firstName: 'First',
			lastName: 'last',
			password: 'password',
			passwordConfirm: 'password2',
		})
		.expect(400);
});

it('returns status 400 if user with the same email already exists', async () => {
	const connect = getConnection('test');
	const userRep = connect.getRepository(User);
	const newUser = userRep.create({
		email: 'valid@email.com',
		firstName: 'First',
		lastName: 'last',
		password: 'password',
	});

	await userRep.save(newUser);

	await request(app)
		.post('/api/v1/users')
		.send({
			email: 'valid@email.com',
			firstName: 'First',
			lastName: 'last',
			password: 'password',
			passwordConfirm: 'password',
		})
		.expect(400);
});

it('create new user SIGNUP POST /api/v1/users returns 201', async () => {
	const res = await request(app)
		.post('/api/v1/users')
		.send({
			email: 'valid@email.com',
			firstName: 'First',
			lastName: 'last',
			password: 'password',
			passwordConfirm: 'password',
		})
		.expect(201);
	const connect = getConnection('test');
	const userRep = connect.getRepository(User);
	const dbUser = await userRep.findOne();

	expect(dbUser).toBeDefined();
	expect(res.body.data.user.email).toEqual('valid@email.com');
});

//LOGIN POST on /api/v1/users/login exprected email,password

it('returns 400 if provided with wrong email', async () => {
	const res = await request(app)
		.post('/api/v1/users/login')
		.send({
			email: 'invalid@email.com',
			password: 'password',
		})
		.expect(400);
});

it('returns 400 if provided with wrong password', async () => {
	const res = await request(app).post('/api/v1/users').send({
		email: 'valid@email.com',
		firstName: 'First',
		lastName: 'last',
		password: 'password',
		passwordConfirm: 'password',
	});

	await request(app)
		.post('/api/v1/users/login')
		.send({
			email: res.body.data.user.email,
			password: 'password2',
		})
		.expect(400);
});

it('returns 200 if provided with right email and password', async () => {
	const res = await request(app).post('/api/v1/users').send({
		email: 'valid@email.com',
		firstName: 'First',
		lastName: 'last',
		password: 'password',
		passwordConfirm: 'password',
	});

	await request(app)
		.post('/api/v1/users/login')
		.send({
			email: res.body.data.user.email,
			password: 'password',
		})
		.expect(200);
});

//LOGOUT POST /api/v1/users/logout

it('clears the cookie after signing out', async () => {
	const response = await request(app)
		.post('/api/v1/users/logout')
		.send({})
		.expect(200);
	console.log(response.get('Set-Cookie')[0]);
	//cookie cleared
	expect(response.get('Set-Cookie')[0]).toEqual(
		'jwt=loggedout; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
	);
});
