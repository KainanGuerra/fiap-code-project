import request from 'supertest';
import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';
import { generateTestPost } from '../utils/generate-posts';

e2eDescribe('PostController (e2e)', (app) => {
  let token: string;
  let postId: string;
  let postDto: any;

  beforeEach(async () => {
    // Cria usuário
    const userDto = generateTestUser('PROFESSOR');
    const userResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    token = userResponse.body.accessToken;

    // Cria post
    postDto = generateTestPost();
    const postResponse = await request(app().getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto);

    postId = postResponse.body.id;
  });

  it('PATCH /posts/:id should update a post by ID', async () => {
    const updatedPost = {
      title: 'Título atualizado',
      content: 'Conteúdo atualizado',
    };

    const patchRes = await request(app().getHttpServer())
      .patch(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPost);

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.title).toBe(updatedPost.title);
    expect(patchRes.body.content).toBe(updatedPost.content);
  });

  it('PATCH /posts/:id/remove should remove a post by ID', async () => {
    const deleteRes = await request(app().getHttpServer())
      .patch(`/posts/${postId}/remove`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const getRes = await request(app().getHttpServer())
      .patch(`/posts/${postId}/remove`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });
});
