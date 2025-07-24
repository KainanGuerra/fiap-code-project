import request from 'supertest';
import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e)', (app) => {
  let createdUser: { email: string; password: string; name: string; role: string };

  // Teste de criação de usuário
  it('POST /auth/sign-up should create a user', async () => {
    createdUser = generateTestUser();

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
});
