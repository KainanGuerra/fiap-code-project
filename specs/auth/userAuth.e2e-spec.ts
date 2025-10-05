import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e)', (app) => {
  let createdUser: {
    email: string;
    password: string;
    name: string;
    role: string;
  };
  //Sign-up
  // Teste de criação de usuário
  it('POST /auth/sign-up should not create a user without inner-authorization', async () => {
    createdUser = generateTestUser('STUDENT');

    const response = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .send(createdUser);

    expect(response.status).toBe(401);
  });

  it('POST /auth/sign-up should not create a user with invalid inner-authorization', async () => {
    createdUser = generateTestUser('PROFESSOR');

    const response = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', 'invalid_token')
      .send(createdUser);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Unauthorized');
  });

  it('POST /auth/sign-up should create a student', async () => {
    createdUser = generateTestUser('STUDENT');

    const response = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(createdUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toMatchObject({
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    });
  });

  it('POST /auth/sign-up should create professor', async () => {
    createdUser = generateTestUser('PROFESSOR');

    const response = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(createdUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toMatchObject({
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    });
  });

  // Login
  // Teste de login com o mesmo usuário
  it('POST /auth/sign-in should sign-in with a user', async () => {
    const loginDto = {
      email: createdUser.email,
      password: createdUser.password,
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-in')
      .send(loginDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toMatchObject({
      email: loginDto.email,
    });
  });

  it('POST /auth/sign-in should not sign-in with a wrong passord', async () => {
    const loginDto = {
      email: createdUser.email,
      password: "wrongPassword123",
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-in')
      .send(loginDto);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Invalid credentials');
  });

  it('POST /auth/sign-in should not sign-in with non-existing email', async () => {
    const loginDto = {
      email:  'nonexistent@example.com',
      password: createdUser.password,
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-in')
      .send(loginDto);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Invalid credentials');
  });

    it('POST /auth/sign-in should not sign-in with incorrect email format', async () => {
    const loginDto = {
      email:  'invalid-email',
      password: createdUser.password,
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-in')
      .send(loginDto);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Invalid credentials');
  });

  it('POST /auth/sign-in should not sign-in with non-existing email', async () => {
    const loginDto = {
      email:  createdUser.email,
      password: '',
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-in')
      .send(loginDto);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Invalid credentials');
  });

});
