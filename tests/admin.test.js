import jwt from 'jsonwebtoken'
import app from '../server.js'
import request from 'supertest'


describe('Admin test', () => {

    describe('Post api/admin/login', () => {
        it("Admin login with correct credentials", async () => {
            const response = await request(app)
                .post('/api/admin/login')
                .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User login successfully");
            expect(response.body.token).toBeDefined();

            const decoded_token = jwt.verify(response.body.token, process.env.JWT_SECRET)
            expect(decoded_token.userId).toBe(process.env.ADMIN_ID + process.env.ADMIN_EMAIL);
        });

    });
    it("Admin login with incorrect credentials should return 401", async () => {

        const response = await request(app)
            .post('/api/admin/login')
            .send({ email: process.env.ADMIN_EMAIL, password: "test_password" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Credentials");

    });


});
