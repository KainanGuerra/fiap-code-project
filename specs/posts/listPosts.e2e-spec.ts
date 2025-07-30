import request from 'supertest';
import { e2eDescribe } from '../utils/e2e-wrapper';

e2eDescribe('AuthController (e2e)', (app) => {
    // Dados do Usuario
    it('GET /posts should return a list of posts (empty / filled)', async () => {

        const response = await request(app().getHttpServer())
            .get('/posts')
            .set('inner-authorization', process.env.INNER_AUTH!)
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.docs)).toBe(true);

        if (response.body.length === 0) {
            // lista vazia OK
            expect(response.body.docs).toEqual([]);
        } else {
            // lista com dados
            response.body.docs.forEach((user: any) => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('title');
                expect(user).toHaveProperty('content');
            });
        }
    });
});