const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const List = require("../../src/db/models").List;
const Listitem = require("../../src/db/models").Listitem;

describe("List", () => {
    
    
    beforeEach((done) => {
        this.user;
        this.list;
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

        it("should create a list item with a valid listId and item", (done) => {
            Listitem.create({
                listId: this.list.id,
                item: "socks",
                purchased: false,
                max: 20
            })
            .then((item) => {
                expect(item).not.toBeNull();
                expect(item.listId).toBe(this.list.id);
                expect(item.item).toBe("socks");
                expect(item.purchased).toBe(false);
                expect(item.max).toBe(20);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a list without an item", (done) => {
            Listitem.create({
                listId: this.list.id,
                purchased: false,
            })
            .then((item) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('notNull Violation: Listitem.item cannot be null');
                done();
            });
        });
    });

    describe("#destroy()", () => {

        it("should remove the list item from the list", (done) => {
            Listitem.create({
                listId: this.list.id,
                item: "socks",
                purchased: false,
                max: 20
            })
            .then((item) => {
                Listitem.findAll()
                .then((items) => {
                    countedItems = items.length;
                    Listitem.destroy({
                        where: {
                            item: "socks"
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