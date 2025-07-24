import request from 'supertest';
import { e2eDescribe } from './utils/e2e-wrapper';

e2eDescribe('AuthController (e2e)', (app) => {
  // Dados do Usuario
  it('POST /auth/sign-up should create a user', async () => {
    const userDto = {
      email: 'test2@example.com',
      name: "Kaue",
      password: 'password@123',
      role: "PROFESSOR"
    };

    const response = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toMatchObject({
      email: userDto.email,
      name: userDto.name,
      role: userDto.role,
    });
  });
});

