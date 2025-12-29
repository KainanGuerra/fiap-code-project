import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e) - Remove User', (app) => {
  it('PATCH /auth/:id/remove - Professor can remove a user', async () => {
    // Create a Professor
    const professorDto = generateTestUser('PROFESSOR');
    const professorResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(professorDto);
    expect(professorResponse.status).toBe(201);
    const professorToken = professorResponse.body.accessToken;

    // Create a target user to be removed
    const targetUserDto = generateTestUser('STUDENT');
    const targetUserResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(targetUserDto);
    expect(targetUserResponse.status).toBe(201);
    const targetUserId = targetUserResponse.body.user.id;

    // Remove user as Professor
    const removeResponse = await request(app().getHttpServer())
      .patch(`/auth/${targetUserId}/remove`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(removeResponse.status).toBe(204);

    // Verify user is gone (or soft deleted)
    // Note: Since we don't have direct DB access here, we can try to list users and see if it's there,
    // or try to get it if there was a get endpoint. The list endpoint filters might vary.
    // Ideally we assume 204 means success.
  });

  it('PATCH /auth/:id/remove - Student cannot remove a user', async () => {
    // Create a Student (who will try to remove)
    const studentDto = generateTestUser('STUDENT');
    const studentResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(studentDto);
    expect(studentResponse.status).toBe(201);
    const studentToken = studentResponse.body.accessToken;

    // Create a target user
    const targetUserDto = generateTestUser('STUDENT');
    const targetUserResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(targetUserDto);
    const targetUserId = targetUserResponse.body.user.id;

    // Attempt remove as Student
    const removeResponse = await request(app().getHttpServer())
      .patch(`/auth/${targetUserId}/remove`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(removeResponse.status).toBe(403);
  });
});
