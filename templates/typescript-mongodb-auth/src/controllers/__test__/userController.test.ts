import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

it('returns status 200 on /api/v1/users', async () => {
  return request(app).get('/api/v1/users').expect(200);
});

it('returns an array of all users GET /api/v1/user', async () => {
  let user1 = User.build({
    email: 'valid@email.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  });

  await user1.save();

  let user2 = User.build({
    email: 'valid2@email.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  });

  await user2.save();

  const res = await request(app).get('/api/v1/users').expect(200);

  expect(res.body.data.length).toEqual(2);
});
