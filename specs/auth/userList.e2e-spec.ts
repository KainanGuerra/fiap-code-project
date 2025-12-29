import request from 'supertest';

import { e2eDescribe } from '../utils/e2e-wrapper';
import { generateTestUser } from '../utils/generate-user';

e2eDescribe('AuthController (e2e) - List Users', (app) => {
  it('GET /auth - Professor can list users', async () => {
    // Create a Professor
    const professorDto = generateTestUser('PROFESSOR');
    const professorResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(professorDto);
    expect(professorResponse.status).toBe(201);
    const professorToken = professorResponse.body.accessToken;

    // List users
    const response = await request(app().getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${professorToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(Array.isArray(response.body.docs)).toBe(true);
  });

  it('GET /auth - Student cannot list users', async () => {
    // Create a Student
    const studentDto = generateTestUser('STUDENT');
    const studentResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(studentDto);
    expect(studentResponse.status).toBe(201);
    const studentToken = studentResponse.body.accessToken;

    // Attempt list
    const response = await request(app().getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(response.status).toBe(403);
  });

  it('GET /auth should return a list of users (empty / filled)', async () => {
    const response = await request(app().getHttpServer())
      .get('/auth')
      .set('inner-authorization', process.env.INNER_AUTH!);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs');
    expect(Array.isArray(response.body.docs)).toBe(true);

    if (response.body.docs.length === 0) {
      // lista vazia OK
      expect(response.body.docs).toEqual([]);
    } else {
      // lista com dados
      response.body.docs.forEach((user: any) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('role');
      });
    }
  });

  it('GET /auth should filter users by email', async () => {
    // Create a user first
    const userDto = generateTestUser('PROFESSOR');
    const createResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createResponse.status).toBe(201);
    const createdEmail = createResponse.body.user.email;

    // Filter by email
    const response = await request(app().getHttpServer())
      .get(`/auth?email=${createdEmail}`)
      .set('inner-authorization', process.env.INNER_AUTH!);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs');
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBeGreaterThan(0);
    response.body.docs.forEach((user: any) => {
      expect(user.email).toBe(createdEmail);
    });
  });

  it('GET /auth should filter users by role', async () => {
    // Create a student user
    const userDto = generateTestUser('STUDENT');
    const createResponse = await request(app().getHttpServer())
      .post('/auth/sign-up')
      .set('inner-authorization', process.env.INNER_AUTH!)
      .send(userDto);

    expect(createResponse.status).toBe(201);

    // Filter by role
    const response = await request(app().getHttpServer())
      .get('/auth?role=STUDENT')
      .set('inner-authorization', process.env.INNER_AUTH!);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('totalDocs');
    expect(Array.isArray(response.body.docs)).toBe(true);
    expect(response.body.docs.length).toBeGreaterThan(0);
    response.body.docs.forEach((user: any) => {
      expect(user.role).toBe('STUDENT');
    });
  });
});
