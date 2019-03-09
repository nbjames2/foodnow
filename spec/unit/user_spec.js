const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {

        it("should create a user with a valid email and password", (done) => {
            User.create({
                email: 'bill@example.com',
                password: "123456789"
            })
            .then((user) => {
                expect(user.email).toBe('bill@example.com');
                expect(user.password).toBe('123456789');
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a user with an invalid email or password", (done) => {
            User.create({
                email: 'billyboy13',
                password: '123456789'
            })
            .then((user) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('must be a valid email');
                done();
            })
        })

        it("should not create a user with a duplicate email address", (done) => {
            User.create({
                email: 'bill@example.com',
                password: '12345679'
            })
            .then((user) => {
                User.create({
                    email: 'bill@example.com',
                    password: '987654321'
                })
                .then((user2) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain('duplicate email');
                });
            });
        });
    });
});