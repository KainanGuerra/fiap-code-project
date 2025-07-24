import request from 'supertest';
import { e2eDescribe } from './utils/e2e-wrapper';

e2eDescribe('AppController (e2e)', (app) => {

  it('/ (GET)', () => {
    return request(app().getHttpServer())
      .get('/status')
      .expect(200)
  });
});
