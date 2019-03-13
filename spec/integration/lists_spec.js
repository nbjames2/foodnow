const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/lists";
const sequelize = require("../../src/db/models/index").sequelize;

const List = require("../../src/db/models").List;
const Listitem = require("../../src/db/models").Listitem;
const ListAccess = require("../../src/db/models").ListAccess;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {

    beforeEach((done) => {
        this.list;
        this.listitem;
        this.listaccess;
        this.user;
   
        sequelize.sync({force: true}).then(() => {
            User.create({
                email: 'bill@example.com',
                password: '123456789'
            })
            .then((user) => {
                this.user = user;
                List.create({
                    userId: this.user.id,
                    title: "shopping",
                    lastUpdated: new Date(Date.now()).toLocaleString()
                })
                .then((list) => {
                    this.list = list;
                    Listitem.create({
                        listId: this.list.id,
                        item: "socks",
                        max: 20,
                        purchased: false
                    })
                    .then((listitem) => {
                        this.listitem = listitem;
                        ListAccess.create({
                            userId: this.user.id,
                            listId: this.list.id
                        })
                        .then((listaccess) => {
                            this.listaccess = listaccess;
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });

    describe("guest user performing CRUD actions for List", () => {

        beforeEach((done) => {
            this.user = null;
            done();  
        });
    
        describe("GET /lists/:listId/new", () => {

            it("should redirect to the sign up form when a guest tries to add a new list", (done) => {
                request.get(`${base}/${this.list.id}/new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Cannot GET /lists/1/new");
                    done();
                });
            });
        });

        describe("POST /lists/:listId/new", () => {

            it("should not create a new list for guest", (done) => {
                const options = {
                    url: `${base}/${this.list.id}/new`,
                    form: {
                        title: "Shopping",
                        lastUpdated: new Date(Date.now()).toLocaleString()
                    }
                };
                request.post(options, (err, res, body) => {
                    List.findOne({where: {title: "Shopping"}})
                    .then((list) => {
                        expect(list).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

            it("should not create a new list that fails validations", (done) => {
                const options = {
                    url: `${base}/${this.list.id}/new`,
                    form: {
                        title: "a"
                    }
                };
                request.post(options, (err, res, body) => {
                    List.findOne({where: {title: "a"}})
                    .then((list) => {
                        expect(list).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });

        describe("GET /lists/:listId", () => {

            it("should not render a view with the selected list if user is not signed in", (done) => {
                request.get(`${base}/${this.list.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).not.toContain("socks");
                    done();
                });
            });
        });

        describe("POST /lists/:listId/destroy", () => {

            it("should not delete list for guest user", (done) => {
                expect(this.list.id).toBe(1);
                request.post(`${base}/${this.list.id}/destroy`, (err, res, body) => {
                    List.findById(1)
                    .then((list) => {
                        expect(err).toBeNull();
                        expect(list.title).toBe("shopping");
                        done();
                    })
                });
            });
        });

        describe("GET /lists/:listId/edit/:listitemId", () => {

            it("should not allow guest to access view to edit item", (done) => {
                request.get(`${base}/${this.list.id}/edit/${this.listitem.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Cannot read property");
                    done();
                });
            });
        });

        describe("POST /lists/:listId/edit/:itemId", () => {

            it("should return a status code 302", (done) => {
                request.post({
                    url: `${base}/${this.list.id}/edit/${this.listitem.id}`,
                    form: {
                        title: "underwear",
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                });
            });

            it("should not allow guest to update the listitem", (done) => {
                const options = {
                    url: `${base}/${this.list.id}/edit/${this.listitem.id}`,
                    form: {
                        title: "Underwear",
                    }
                };
                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Listitem.findOne({
                        where: { id: this.listitem.id}
                    })
                    .then((listitem) => {
                        expect(listitem.item).toBe("socks");
                        done();
                    });
                });
            });
        });

        describe("POST /lists/:listId/access", () => {

            it("should not allow a guest to add access to a list", (done) => {
                User.create({
                    email: "tony@example.com",
                    password: "987654321"
                })
                .then((user) => {
                    request.post({
                        url: `/lists/${this.list.id}/access`,
                        form: {
                            email: 'tony@example.com'
                        }
                    }, (err, res, body) => {
                        ListAccess.findOne({
                            where: {
                                userId: user.id
                            }
                        })
                        .then((access) => {
                            expect(access).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                    })
                });
            });
        });

        describe("GET /lists/:listId/destroy/:listitemId", () => {

            it("should not allow a guest to delete a listitem", (done) => {
                request.get(`/lists/${this.list.id}/destroy/${this.listitem.id}`, (err, res, body) => {
                    expect(body).toBe(undefined);
                    done();
                });
            });
        });

        describe("GET /lists/:listId/purchased/:listitemId", () => {
            
            it("should not allow a guest to mark an item as purchased", (done) => {
                request.get(`/lists/${this.list.id}/purchased/${this.listitem.id}`, (err, res, body) => {
                    expect(body).toBe(undefined)
                    done();
                });
            });
        });
    });

    describe("member user performing crud operations on Posts", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    email: this.user.email,
                    userId: this.user.id
                }
            },(err, res, body) => {
                done();
            });
        });

        describe("GET /lists/new", () => {

            it("should render a new list form", (done) => {
                request.get(`${base}/new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Create a new list");
                    done();
                });
            });
        });
    
        describe("POST /lists/new", () => {
    
            it("should create a new list and redirect", (done) => {
                const options = {
                    url: `${base}/new`,
                    form: {
                        title: "Get me this",
                    }
                };
                request.post(options, (err, res, body) => {
                    List.findOne({where: {title: "Get me this"}})
                    .then((list) => {
                        expect(list).not.toBeNull();
                        expect(list.title).toBe("Get me this");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
    
            it("should not create a new list that fails validations", (done) => {
                const options = {
                    url: `${base}/new`,
                    form: {
                        title: "a"
                    }
                };
                request.post(options, (err, res, body) => {
                    List.findOne({where: {title: "a"}})
                    .then((list) => {
                        expect(list).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });

        describe("GET /lists", () => {

            it("should render a view with the users lists", (done) => {
                request.get(`${base}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("shopping");
                    done();
                });
            });
        });
    
        describe("GET /lists/:listId", () => {
    
            it("should render a view with the selected list", (done) => {
                request.get(`${base}/${this.list.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("socks");
                    done();
                });
            }); 
        });
    
        describe("GET /lists/:listId/destroy", () => {
    
            // it("should delete the list with the associated ID", (done) => {
            //     expect(this.list.id).toBe(1);
            //     request.get(`${base}/${this.list.id}/destroy`, (err, res, body) => {
            //         List.findById(1)
            //         .then((list) => {
            //             expect(err).toBeNull();
            //             expect(list).toBeNull();
            //             done();
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //             done();
            //         })
            //     });
            // });

        //     it("should not delete a list for someone that does not have access permission", (done) => {
        //         User.create({
        //             email: "imposter@example.com",
        //             password: "654321"
        //         })
        //         .then((user) => {
        //             request.get({
        //                 url: "http://localhost:3000/auth/fake",
        //                 form: {
        //                     email: user.email,
        //                     userId: user.id
        //                 }
        //             },
        //                 (err, res, body) => {
        //                     expect(this.list.id).toBe(1);
        //                     request.get(`${base}/${this.list.id}/destroy`, (err, res, body) => {
        //                         List.findById(1)
        //                         .then((list) => {
        //                             expect(err).toBeNull();
        //                             expect(list.title).toBe("shopping");
        //                             done();
        //                         })
        //                     });
        //                 }
        //             );
        //         });    
        //     })
        });
    
        describe("GET /lists/:listId/edit/:listitemId", () => {
    
            it("should render a view with an edit listitem form", (done) => {
                request.get(`${base}/${this.list.id}/edit/${this.listitem.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit");
                    expect(body).toContain("socks");
                    done();
                });
            });

            // it("should not render the edit view for a member who does not have access to the list", (done) => {
            //     User.create({
            //         email: "imposter@example.com",
            //         password: "654321",
            //     })
            //     .then((user) => {
            //         request.get({
            //             url: "http://localhost:3000/auth/fake",
            //             form: {
            //             email: user.email,
            //             userId: user.id
            //             }
            //         },
            //             (err, res, body) => {
            //                 request.get(`${base}/${this.list.id}/edit/${this.listitem.id}`, (err, res, body) => {
            //                     expect(err).toBeNull();
            //                     expect(body).not.toContain("Edit");
            //                     done();
            //                 });
            //             }
            //         );
            //     });    
            // })
        });
    
        describe("POST /lists/:listId/edit/:listitemId", () => {
    
            it("should return a status code 302", (done) => {
                request.post({
                    url: `${base}/${this.list.id}/edit/${this.listitem.id}`,
                    form: {
                        item: "underwear"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(303);
                    done();
                });
            });
    
            it("should update the post with the given values", (done) => {
                const options = {
                    url: `${base}/${this.list.id}/edit/${this.listitem.id}`,
                    form: {
                        item: "underwear",
                        purchased: this.listitem.purchased,
                        max: this.listitem.max
                    }
                };
                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Listitem.findOne({
                        where: {id: this.listitem.id}
                    })
                    .then((listitem) => {
                        expect(listitem.item).toBe("underwear");
                        done();
                    });
                });
            });

            it("should not update the post for a user that is not the owner", (done) => {
                User.create({
                    email: "imposter@example.com",
                    password: "654321",
                })
                .then((user) => {
                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                        email: user.email,
                        userId: user.id
                        }
                    },
                        (err, res, body) => {
                            const options = {
                                url: `${base}/${this.list.id}/edit/${this.listitem.id}`,
                                form: {
                                    item: "underwear",
                                    purchased: this.listitem.purchased,
                                    max: this.listitem.max
                                }
                            };
                            request.post(options, (err, res, body) => {
                                expect(err).toBeNull();
                                Listitem.findOne({
                                    where: {id: this.listitem.id}
                                })
                                .then((listitem) => {
                                    expect(listitem.item).toBe("socks");
                                    done();
                                });
                            });
                        }
                    );
                });
            })
        });

        describe("GET /lists/:listId/newItem", () => {

            it("should render new item form", (done) => {
                request.get(`${base}/${this.list.id}/newItem`, (err, res, body) => {
                    expect(body).toContain("Create a new item");
                    done();
                });
            });
        });

        describe("POST /lists/:listId/newItem", () => {

            it("should create a new item", (done) => {
                request.post({
                    url: `${base}/${this.list.id}/newItem`,
                    form: {
                        item: "underwear",
                        max: 20,
                        purchased: false
                    }
                }, (err, res, body) => {
                    Listitem.findOne({where: {item: "underwear"}})
                    .then((listitem) => {
                        expect(listitem).not.toBeNull();
                        expect(listitem.item).toBe("underwear");
                        expect(listitem.max).toBe(20);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
        
        // describe("POST /lists/:listId/access", () => {

        //     it("should create listaccess for another user", (done) => {
        //         User.create({
        //             email: "tony@example.com",
        //             password: "987654321"
        //         })
        //         .then((user) => {
        //             request.post({
        //                 url: `${base}/${this.list.id}/access`,
        //                 form: {
        //                     email: "tony@example.com"
        //                 }
        //             }, (err, res, body) => {
        //                 ListAccess.findOne({where:{userId: user.id}})
        //                 .then((access) => {
        //                     expect(access).not.toBeNull();
        //                     expect(access.userId).toBe(user.Id);
        //                     expect(access.listId).toBe(this.list.id);
        //                     done();
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                     done();
        //                 });
        //             });
        //         });
        //     });
        // });

        describe("GET /lists/:listId/purchased/:listitemId", () => {

            it("should mark listitem as purchased", (done) => {
                expect(this.listitem.purchased).toBe(false);
                request.get(`${base}/${this.list.id}/purchased/${this.listitem.id}`, (err, res, body) => {
                    Listitem.findOne({where:{id: this.listitem.id}})
                    .then((listitem) => {
                        expect(listitem.purchased).toBe(true);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });

        describe("GET /lists/:listId/destroy/:listitemId", () => {

            it("should remove a listitem from the list", (done) => {
                expect(this.listitem.id).toBe(1);
                request.get(`${base}/${this.list.id}/destroy/${this.listitem.id}`, (err, res, body) => {
                    Listitem.findById(this.listitem.id)
                    .then((listitem) => {
                        expect(listitem).toBeNull();
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