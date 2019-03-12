const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const List = require("../../src/db/models").List;
const Listitem = require("../../src/db/models").Listitem;
const Listaccess = require("../../src/db/models").ListAccess;

describe("List", () => {
    
    
    beforeEach((done) => {
        this.user;
        this.list;
        this.listaccess;
        const datetime = new Date(Date.now()).toLocaleString();

        sequelize.sync({force: true})
        .then(() => {
            User.create({
                email: 'bill@example.com',
                password: '123456789'
            })
            .then((user) => {
                this.user = user;
                List.create({
                    userId: this.user.id,
                    title: "shopping",
                    lastUpdated: datetime
                })
                .then((list) => {
                    this.list = list;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#create()", () => {

        it("should create a listaccess entry with a valid listId and userId", (done) => {
            Listaccess.create({
                userId: this.user.id,
                listId: this.list.id
            })
            .then((access) => {
                expect(access).not.toBeNull();
                expect(access.userId).toBe(this.user.id);
                expect(access.listId).toBe(this.list.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a list access entry without a listId", (done) => {
            Listaccess.create({
                userId: this.user.id
            })
            .then((access) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('notNull Violation: ListAccess.listId cannot be null');
                done();
            });
        });
    });

    describe("#destroy()", () => {

        it("should remove the list access from the list", (done) => {
            Listaccess.create({
                userId: this.user.id,
                listId: this.list.id
            })
            .then((access) => {
                Listaccess.findAll()
                .then((access) => {
                    countedItems = access.length;
                    Listaccess.destroy({
                        where: {
                            listId: this.list.id
                        }
                    })
                    .then(() => {
                        Listitem.findAll()
                        .then((items) => {
                            expect(items.length).toBe(countedItems -1);
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