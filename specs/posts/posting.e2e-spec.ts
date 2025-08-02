import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestPost } from '../utils/generate-posts';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('PostController (e2e)', (app) => {
  it('POST /posts should create a post', async () => {
    // Create a user professor first to get a token
    const userDto = generateTestUser();
    const userresponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    const token = userresponse.body.accessToken;

    const postDto = generateTestPost();

    const response = await request(app().getHttpServer())
      .post('/posts')
      .send(postDto)
      .set('Authorization', `Bearer ${token}`);

    if (userresponse.body.user.role !== 'PROFESSOR') {
      expect(response.status).toBe(403);
    } else {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(postDto.title);
    }
  });
});
