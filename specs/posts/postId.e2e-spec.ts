import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestPost } from '../utils/generate-posts';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('PostController (e2e)', (app) => {
  it('GET /posts/:ID should get a post by a specific ID', async () => {
    // Create a user
    const userDto = generateTestUser();
    const userresponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    const token = userresponse.body.accessToken;

    // Create a post
    const postDto = generateTestPost();
    const postresponse = await request(app().getHttpServer())
      .post('/posts')
      .send(postDto)
      .set('Authorization', `Bearer ${token}`);

    const postID = postresponse.body.id;

    const response = await request(app().getHttpServer())
      .get(`/posts/${postID}`)
      .set('inner-authorization', process.env.INNER_AUTH!);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(postDto.title);
    expect(response.body.content).toBe(postDto.content);
  });
});
