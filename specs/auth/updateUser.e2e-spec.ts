import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e) - Update User', (app) => {
  it('PATCH /auth/:id updates a user with ID (Professor)', async () => {
    // Create user (Professor)
    const userDto = generateTestUser('PROFESSOR');
    const createResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createResponse.status).toBe(201);
    const userId = createResponse.body.user.id;
    const token = createResponse.body.accessToken;

    // Update user
    const newName = 'Updated Name';
    const updateResponse = await request(app().getHttpServer())
      .patch(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newName });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe(newName);
  });

  it('PATCH /auth/:id should not update the email even if provided', async () => {
    // Create user
    const userDto = generateTestUser('PROFESSOR');
    const createResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    const userId = createResponse.body.user.id;
    const originalEmail = createResponse.body.user.email;
    const token = createResponse.body.accessToken;

    // Try to update email
    const updateResponse = await request(app().getHttpServer())
      .patch(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newemail@example.com', name: 'New Name' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.email).toBe(originalEmail);
    expect(updateResponse.body.name).toBe('New Name');
  });

  it('PATCH /auth/:id fails if user is not professor', async () => {
    // Create student
    const studentDto = generateTestUser('STUDENT');
    const createResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(studentDto);

    expect(createResponse.status).toBe(201);
    const userId = createResponse.body.user.id;
    const token = createResponse.body.accessToken;

    // Try to update
    const newName = 'Should Not Update';
    const updateResponse = await request(app().getHttpServer())
      .patch(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newName });

    expect(updateResponse.status).toBe(403);
  });
});
