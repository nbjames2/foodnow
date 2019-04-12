const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const List = require("../../src/db/models").List;

describe("List", () => {
    
    beforeEach((done) => {
        this.user;
        

        sequelize.sync({force: true})
        .then(() => {
            User.create({
                email: 'bill@example.com',
                password: '123456789'
            })
            .then((user) => {
                this.user = user;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#create()", () => {

        it("should create a list with a valid title", (done) => {
            const datetime = new Date(Date.now()).toLocaleString();
            List.create({
                userId: this.user.id,
                title: "shopping",
                lastUpdated: datetime
            })
            .then((list) => {
                console.log(list);
                expect(list).not.toBeNull();
                expect(list.userId).toBe(1);
                expect(list.title).toBe("shopping");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a list without a title", (done) => {
            List.create({
                userId: this.user.id,
                lastUpdated: '123'
            })
            .then((list) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('notNull Violation: List.title cannot be null');
                done();
            });
        });
    });

    describe("#destroy()", () => {

        it("should remove the list from the database", (done) => {
            List.create({
                userId: this.user.id,
                title: "shopping",
                lastUpdated: '123'
            })
            .then((list) => {
                List.findAll()
                .then((lists) => {
                    countedList = lists.length;
                    List.destroy({
                        where: {
                            title: "shopping"
                        }
                    })
                    .then(() => {
                        List.findAll()
                        .then((lists) => {
                            expect(lists.length).toBe(countedList -1);
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    });
                });
            });
        });
    });
});