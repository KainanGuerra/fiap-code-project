import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e)', (app) => {
  // Teste remover usuário
  it('PATCH /auth/:id/remove remove a user with ID', async () => {
    //Cria usuario
    const userDto = generateTestUser('PROFESSOR');

    const createresponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createresponse.status).toBe(201);

    //Deleta usuário
    const postId = createresponse.body.user.id;

    const response = await request(app().getHttpServer())
      .patch(`/auth/${postId}/remove`)
      .set('inner-authorization', process.env.INNER_AUTH!);
    expect(response.status).toBe(200);
  });

  it('PATCH /auth/:id/remove should not soft remove a user if not found', async () => {
    //Cria usuario
    const userDto = generateTestUser('PROFESSOR');
    const nonExistentId = 'usr_00000000000000000000000000';

    const createresponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createresponse.status).toBe(201);

    //Deleta usuário
    const postId = createresponse.body.user.id;

    const response = await request(app().getHttpServer())
      .patch(`/auth/${nonExistentId}/remove`)
      .set('inner-authorization', process.env.INNER_AUTH!);
    expect(response.status).toBe(404);
    expect(response.body.message).toContain(`Could not find any entity with id: ${nonExistentId}`);
  });

  it('PATCH /auth/:id/remove should not soft remove a user without inner-authorization', async () => {
    //Cria usuario
    const userDto = generateTestUser('PROFESSOR');

    const createresponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createresponse.status).toBe(201);

    //Deleta usuário
    const postId = createresponse.body.user.id;

    const response = await request(app().getHttpServer())
      .patch(`/auth/${postId}/remove`)
      .set('inner-authorization', 'invalid_token');
    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Unauthorized');
  });

});
