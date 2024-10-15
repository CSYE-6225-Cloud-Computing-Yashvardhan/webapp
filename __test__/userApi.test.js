const request = require("supertest");
const app = require("../index");
const database = require("../configs/sequelizeConfig");

const currentDate = Date.now().toString();
const userData = {
    first_name: `Yash_${currentDate}`,
    last_name: "Limbodiya",
    password: "yash123",
    email: `yash_${currentDate}@email.com`
}

describe("Integration Test", () => {
    beforeAll(async () => {
        await database.sequelize.sync().catch(error => console.log("DB error: " + error));
    });

    it('Create user account and validate using GET request', async () => {

        const createUserApiResponse = await request(app).post("/v1/user").send(userData);
        console.log("createUserApiResponse.statusCode: " + createUserApiResponse.statusCode);
        expect(createUserApiResponse.statusCode).toBe(201);


        const getUserApiResponse = await request(app).get(`/v1/user/self`).set('Authorization', `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`);
        expect(getUserApiResponse.statusCode).toBe(200);
        expect(getUserApiResponse.body.email).toBe(userData.email);

    });

    it('Testing CREATE request without payload', async () => {
        const getUserApiResponse = await request(app).post(`/v1/user/`);
        expect(getUserApiResponse.statusCode).toBe(400);
    });

    it('Update user account and validate using GET request', async () => {
        userData.first_name = "Yashvardhan";
        const updateUserApiResponse = await request(app).put("/v1/user/self")
            .set('Authorization', `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`)
            .send(userData);
        expect(updateUserApiResponse.statusCode).toBe(204);

        const getUserApiResponse = await request(app).get(`/v1/user/self`).set('Authorization', `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`);
        expect(getUserApiResponse.statusCode).toBe(200);
        expect(getUserApiResponse.body.first_name).toBe("Yashvardhan");
    });

    it('Testing not allowed http methods', async () => {
        const getUserApiResponse = await request(app).options(`/v1/user/self`).set('Authorization', `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`);
        expect(getUserApiResponse.statusCode).toBe(405);
    });

    it('Testing with invalid user', async () => {
        const getUserApiResponse = await request(app).get(`/v1/user/self`).set('Authorization', `Basic ${Buffer.from("invalid@email.com:12345").toString('base64')}`);
        expect(getUserApiResponse.statusCode).toBe(401);
    });

    it('Testing GET request with payload', async () => {
        const getUserApiResponse = await request(app).get(`/v1/user/self`).send(userData).set('Authorization', `Basic ${Buffer.from("invalid@email.com:12345").toString('base64')}`);
        expect(getUserApiResponse.statusCode).toBe(400);
    });
    console.log(abc.abc);

});
