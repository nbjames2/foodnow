const User = require("../db/models").User;
const List = require("../db/models").List;
const Listitem = require("../db/models").Listitem;
const ListAccess = require("../db/models").ListAccess;

module.exports = {
    getLists(user, callback){
        var lists = [];
        ListAccess.findAll({
            where: {
                userId: user.id
            }
        })
        .then((accesses) => {
            if(accesses[0]) {
                accesses.forEach((access) => {
                    List.findOne({ where: { id: access.listId}})
                    .then((list) => {
                        lists.push(list);
                        if(accesses.length == lists.length) {
                            callback(null, lists);
                        }
                    })
                    .catch((err) => {
                        callback(err);
                    });
                }); 
            } else {
                callback(null, null);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },
    createList(userId, title, callback) {
        const dateTime = new Date(Date.now()).toLocaleString();
        List.create({
            userId: userId,
            title: title,
            lastUpdated: dateTime
        })
        .then((list) => {
            ListAccess.create({
                userId: userId,
                listId: list.id
            })
            .then((access) => {
                callback(null, list);
            })
            .catch((err) => {
                callback(err);
            });
        })
        .catch((err) => {
            callback(err);
        });
    },
    viewList(listId, callback) {
        Listitem.findAll({
            where: {
                listId: listId
            },
            order: [
                ['purchased', 'ASC']
            ]
        })
        .then((items) => {
            callback(null, items);
        })
        .catch((err) => {
            callback(err);
        });
    },
    newListItem(body, id, callback) {
        Listitem.create({
            listId: id,
            item: body.item,
            max: body.max || null
        })
        .then((item) => {
            List.findOne({ where: { id: id } } )
            .then((list) => {
               let updatedList = list;
               updatedList.lastUpdated = new Date(Date.now()).toLocaleString();
               list.update(updatedList, {
                   fields: Object.keys(updatedList)
               })
               .then((listUpdated) => {
                   callback(null, item);
               })
               .catch((err) => {
                   callback(err);
               });
            });
        });
    },
    updatePurchase(itemId, callback) {
        let purchased;
        Listitem.findOne({ where: {id: itemId} })
        .then((item) => {
            if(item.purchased == false) {
                purchased = true;
            } else {
                purchased = false;
            }
            item.update({
                purchased: purchased
            })
            .then((itemUpdated) => {
                callback(null, itemUpdated);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },
    getItem(itemId, callback) {
        Listitem.findOne({ where: {id: itemId} })
        .then((item) => {
            callback(null, item);
        })
        .catch((err) => {
            callback(err);
        });
    },
    editItem(body, itemId, callback) {
        let purchased;
        if(body.purchased){
            purchased = true;
        } else {
            purchased = false;
        }
        Listitem.findOne({ where: {id: itemId} })
        .then((item) => {
            item.update({
                item: body.item,
                max: body.max,
                purchased: purchased
            })
            .then((newItem) => {
                callback(null, newItem);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },
    addAccess(listId, body, callback) {
        User.findOne({ 
            where: {
                email: body.email
            }
        })
        .then((user) => {
            if(!user){
                callback(null, 'no user');
            } else {
                ListAccess.create({
                    userId: user.id,
                    listId: listId
                })
                .then((access) => {
                    callback(null, access);
                })
                .catch((err) => {
                    callback(err);
                });
            }
        });
    },
    destroyList(listId, callback){
        List.destroy({
            where: {
                id: listId
            }
        })
        .then(() => {
            callback(null, "destroyed");
        })
        .catch((err) => {
            callback(err);
        });
    },
    checkAccess(userId, listId, callback) {
        ListAccess.findAll({
            where: {
                userId: userId,
                listId: listId
            }
        })
        .then((access) => {
            if(access){
                callback(null, access[0]);
            } else {
                callback(null, null);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },
    destroyItem(itemId, callback){
        Listitem.destroy({
            where: {
                id: itemId
            }
        })
        .then(() => {
            callback(null, "destroyed");
        })
        .catch((err) => {
            callback(err);
        });
    }
}