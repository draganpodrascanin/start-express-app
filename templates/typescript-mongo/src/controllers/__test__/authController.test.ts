import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

it(`returns status 400 on /a POSTpi/v1/users (signupController)
    when providing different password and passwordConfirm`, async () => {
  const res = await request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'valid2@email.com',
      password: 'password',
      passwordConfirm: 'different password',
    })
    .expect(400);
});

it(`returns status 400 on POST /api/v1/users
    (signupController) with invalid email`, async () => {
  return request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'notanemai',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(400);
});

it(`returns status 400 on POST /api/v1/users
    (signupController) duplicate email(must be unique)`, async () => {
  const user = User.build({
    email: 'double@email.com',
    name: 'valid name',
    password: 'password',
  });

  await user.save();

  return request(app)
    .post('/api/v1/users')
    .send({
      name: user.name,
      email: user.email,
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(400);
});

it(`returns status 201 on POST /api/v1/users
    (signupController) and make new User in db
    if provided with valid name,email,password`, async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'valid@email.com',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  const newUser = response.body.data;

  const user = await User.findById(newUser._id);

  expect(user).toBeDefined();
});

it(`returns status 201 on POST /api/v1/users
    (signupController) and make new User in db
    if provided with valid name,email,password`, async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'valid@email.com',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  const newUser = response.body.data;

  const user = await User.findById(newUser._id);

  expect(user).toBeDefined();
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'valid@email.com',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

//========================================== SIGN IN ================================================================

it('fails when email that does not exist is supplied POST /api/v1/users/login', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'notexisting@email.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when incorrect password is supplied POST /api/v1/users/login', async () => {
  const user = User.build({
    email: 'test@test.com',
    name: 'valid name',
    password: 'password',
  });

  await user.save();

  await request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'test@test.com',
      password: 'wrongpassword',
    })
    .expect(400);
});

it('respond with a cookie when given valid credentials POST /api/v1/users/login', async () => {
  const user = User.build({
    email: 'test@test.com',
    name: 'valid name',
    password: 'password',
  });

  await user.save();

  const response = await request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

//============== LOG OUT ==================

it('clears the cookie after signing out POST /api/v1/users/logout', async () => {
  await request(app)
    .post('/api/v1/users')
    .send({
      name: 'valid name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/v1/users/logout')
    .send({})
    .expect(200);

  //cookie cleared
  expect(response.get('Set-Cookie')[0]).toEqual('jwt=; Path=/; HttpOnly');
});

//========================= FORGOT PASSWORD ===================================

it(`returns 404 if provided with invalid (not existing) email
   POST /api/v1/users/forgotPassword`, async () => {
  return request(app)
    .post('/api/v1/users/forgotPassword')
    .send({
      email: 'invalid@email.com',
    })
    .expect(404);
});

it(`returns status 200 if provided with valid email
    POST /api/v1/users/forgotPassword`, async () => {
  const newUser = User.build({
    email: 'valid@email.com',
    password: 'password',
    name: 'valid name',
  });

  await newUser.save();

  await request(app)
    .post('/api/v1/users/forgotPassword')
    .send({
      email: newUser.email,
    })
    .expect(200);
});
