import request from 'supertest';
import { e2eDescribe } from './utils/e2e-wrapper';

e2eDescribe('AuthController (e2e)', (app) => {
    // Teste Login user
    it('POST /auth/sign-in should sign-in with a user', async () => {
        const loginDto = {
            email: 'test2@example.com',
            password: 'password@123',
        };

        const response = await request(app().getHttpServer())
            .post('/auth/sign-in')
            //.set('inner-authorization', process.env.INNER_AUTH!)
            .send(loginDto);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toMatchObject({
            email: loginDto.email,
        });
    });
});