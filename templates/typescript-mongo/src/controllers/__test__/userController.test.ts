import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

it('returns status 200 on /api/v1/users', async () => {
  return request(app).get('/api/v1/users').expect(200);
});

it('returns an array of all users GET /api/v1/user', async () => {
  let user1 = User.build({
    email: 'valid@email.com',
    name: 'valid name',
    password: 'password',
  });

  await user1.save();

  let user2 = User.build({
    email: 'valid2@email.com',
    name: 'valid name',
    password: 'password',
  });

  await user2.save();

  const res = await request(app).get('/api/v1/users').expect(200);

  expect(res.body.data.length).toEqual(2);
});

it('returns the current user GET /api/v1/users/currentUser', async () => {
  //signup user
  const signUpResponse = await request(app)
    .post('/api/v1/users')
    .send({
      email: 'valid@email.com',
      name: 'valid name',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  const jwtRecived = signUpResponse.get('Set-Cookie');

  //get loggedin user
  const currentUserResponse = await request(app)
    .get('/api/v1/users/currentUser')
    .set('Cookie', jwtRecived)
    .expect(200);

  expect(currentUserResponse.body.data).toBeDefined();
  expect(currentUserResponse.body.data.email).toEqual(
    signUpResponse.body.data.email
  );
});
