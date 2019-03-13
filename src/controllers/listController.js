const listQueries = require("../db/queries.lists");
const Authorizer = require("../policies/application");
const ItemAuthorizer = require("../policies/listitem");

module.exports = {
    index(req, res, next) {
        const authorized = new Authorizer(req.user.id).new();
        if(authorized) {
            user = req.user;
            listQueries.getLists(user, (err, lists) => {
                if(err){
                    req.flash("notice", "There was an error retrieving your lists");
                    res.render("lists/index");
                } else {
                    res.render("lists/index", {lists});
                }
            });
        } else {
            req.flash("notice", "You need to sign in to view lists");
            res.redirect("/users/signin");
        }
    },
    newListForm(req, res, next) {
        const authorized = new Authorizer(req.user).new();
        if(authorized) {
            res.render("lists/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/");
        }
    },
    create(req, res, next) {
        const authorized = new Authorizer(req.user).new();
        if(authorized){
            userId = req.user.id;
            title = req.body.title;
            listQueries.createList(userId, title, (err, list) => {
                if(err){
                    req.flash("notice", "There was an issue creating your list");
                    res.redirect("/lists");
                } else {
                    res.redirect("/lists");
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/users/signup");
        }
    },
    viewList(req, res, next) {
        const listId = req.params.id;
        const userId = req.user.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to view this list");
                res.redirect(`/lists`);
            } else {
                listQueries.viewList(listId, (err, items) => {
                    res.render("lists/list", {items, listId});
                })
            }
        });
    },
    newItemForm(req, res, next) {
        const userId = req.user.id;
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to create new items");
                res.redirect(`/lists/${listId}`);
            } else {
                res.render("lists/newitem", {listId});
            } 
        });
        
    },
    createItem(req, res, next) {
        const userId = req.user.id;
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to create new items");
                res.redirect(`/lists/${listId}`);
            } else {
                listQueries.newListItem(req.body, listId, (err, item) => {
                    if(err) {
                        req.flash("notice", "Item not added to list");
                        res.redirect(`/lists/${listId}`);
                    } else {
                        res.redirect(`/lists/${listId}`);
                    }
                
                });
            }
        }); 
    },
    editView(req, res, next) {
        const userId = req.user.id;
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to edit items");
                res.redirect(`/lists/${listId}`);
            } else {
                const itemId = req.params.itemId;
                listQueries.getItem(itemId, (err, item) => {
                    if(err){
                        req.flash("notice", "could not retrieve item");
                        res.redirect(`/lists/${listId}`);
                    } else {
                        res.render("lists/edit", {listId, item});
                    }
                });
            }
        });
    },
    edit(req, res, next) {
        const userId = req.user.id;
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to edit items");
                res.redirect(303, `/lists/${listId}`);
            } else {
                const listitem = req.body;
                const itemId = req.params.itemId;
                listQueries.editItem(listitem, itemId, (err, item) => {
                    if(err){
                        req.flash("notice", "item could not be updated");
                        res.redirect(303, `/lists/${listId}`);
                    } else {
                        res.redirect(`/lists/${listId}`);
                    }
                });
            }
        });
    },
    createAccess(req, res, next) { 
        const userId = req.user.id;
        console.log("create access: " + userId);
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to add access to this list");
                res.redirect(`/lists`);
            } else {
                const toAdd = req.body;
                listQueries.addAccess(listId, toAdd, (err, access) => {
                    if(err) {
                        req.flash("notice", "Access not granted to user.");
                        res.redirect("/lists");
                    } else if(access == 'no user'){
                        req.flash('notice', 'No user found with that email.');
                        res.redirect("/lists");
                    } else {
                        req.flash("notice", "User granted access to list.");
                        res.redirect("/lists");
                    }
                });
            }
        });
    },
    deleteList(req, res, next) {
        const userId = req.user.id;
        const listId = req.params.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to delete lists");
                res.redirect(`/lists/${listId}`);
            } else {
                listQueries.destroyList(listId, (err, msg) => {
                    if(err) {
                        req.flash("notice", "Could not delete list.");
                        res.redirect("/lists");
                    } else {
                        req.flash("notice", "List deleted.");
                        res.redirect("/lists");
                    }
                });
            }
        });
    },
    purchase(req, res, next) {
        const listId = req.params.id;
        const itemId = req.params.itemId;
        const userId = req.user.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to update purchase status of items");
                res.redirect(`/lists/${listId}`); 
            } else {
                listQueries.updatePurchase(itemId, (err, item) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.redirect(`/lists/${listId}`);
                    }
                });
            }
        });
    },
    deleteItem(req, res, next) {
        const listId = req.params.id;
        const itemId = req.params.itemId;
        const userId = req.user.id;
        listQueries.checkAccess(userId, listId, (err, access) => {
            if(err || access == null){
                req.flash("notice", "You don't have access to delete items");
                res.redirect(`/lists/${listId}`);
            } else {
                listQueries.destroyItem(itemId, (err, result) => {
                    if(err) {
                        console.log(err);
                        req.flash("notice", "Item could not be deleted.");
                        res.redirect(`/lists/${listId}`);
                    } else {
                        res.redirect(`/lists/${listId}`);
                    }
                })
            }
        });
    }
}