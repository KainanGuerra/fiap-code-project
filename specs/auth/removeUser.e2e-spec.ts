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
});
