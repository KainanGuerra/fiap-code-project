import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';

e2eDescribe('AuthController (e2e)', (app) => {
  // Dados do Usuario
  it('GET /auth should return a list of users (empty / filled)', async () => {
    const response = await request(app().getHttpServer())
      .get('/auth')
      .set('inner-authorization', process.env.INNER_AUTH!);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length === 0) {
      // lista vazia OK
      expect(response.body).toEqual([]);
    } else {
      // lista com dados
      response.body.forEach((user: any) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('role');
      });
    }
  });
});
