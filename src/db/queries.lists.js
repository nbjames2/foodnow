const List = require("../db/models").List;
const Listitem = require("../db/models").Listitem;

module.exports = {
    getLists(user, callback){
        List.findAll({
            where: {
                userId: user.id
            }
        })
        .then((lists) => {
            if(!lists){
                callback(null, null);
            } else {
                callback(null, lists);
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
            callback(null, list);
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
                ['purchased', 'DESC']
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
        .then((item) => {s
            List.findById(id)
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
        Listitem.findById(itemId)
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
        Listitem.findById(itemId)
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
        Listitem.findById(itemId)
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
    }
}