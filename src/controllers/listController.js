const listQueries = require("../db/queries.lists");
const Authorizer = require("../policies/application");
const ItemAuthorizer = require("../policies/listitem");

module.exports = {
    index(req, res, next) {
        user = req.user;
        listQueries.getLists(user, (err, lists) => {
            if(err){
                req.flash("notice", "There was an error retrieving your lists");
                res.render("lists/index");
            } else {
                res.render("lists/index", {lists});
            }
        });
    },
    newListForm(req, res, next) {
        const authorized = new Authorizer(req.user).new();
        if(authorized) {
            res.render("lists/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            req.redirect("/");
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
            req.redirect("/");
        }
    },
    viewList(req, res, next) {
        const listId = req.params.id;
        const ejs_helpers = require('../views/lists/checkbox.js');
        listQueries.viewList(listId, (err, items) => {
            res.render("lists/list", {items, listId, helpers:ejs_helpers});
        })

    },
    newItemForm(req, res, next) {
        const authorized = new ItemAuthorizer(req.user).create();
        if(authorized){
            const id = req.params.id;
            res.render("lists/newitem", {id});
        } else {
            req.flash("notice", "You do not have access to create new items.");
            req.redirect("/lists");
        }
    },
    createItem(req, res, next) {
        const authorized = new ItemAuthorizer(req.user).create();
        if(authorized) {
            const id = req.params.id;
            listQueries.newListItem(req.body, id, (err, item) => {
                if(err) {
                    req.flash("notice", "Item not added to list");
                    res.redirect(`/lists/${id}`);
                } else {
                    res.redirect(`/lists/${id}`);
                }
            });
        } else {
            req.flash("notice", "You do not have access to create new items.");
            req.redirect("/lists");
        }
    },
    editView(req, res, next) {
        const authorized = new ItemAuthorizer(req.user).edit();
        if(authorized){
            const listId = req.params.id;
            const itemId = req.params.itemId;
            listQueries.getItem(itemId, (err, item) => {
                if(err){
                    req.flash("notice", "could not retrieve item");
                    req.redirect(`/lists/${listId}`);
                } else {
                    res.render("lists/edit", {listId, item});
                }
            });
        } else {
            req.flash("notice", "You do not have access to edit this item.");
            req.redirect("/lists");
        }
    },
    edit(req, res, next) {
        const authorized = new ItemAuthorizer(req.user).edit();
        if(authorized){
            const listitem = req.body;
            const listId = req.params.id;
            const itemId = req.params.itemId;
            listQueries.editItem(listitem, itemId, (err, item) => {
                if(err){
                    req.flash("notice", "item could not be updated");
                    req.redirect(`/lists/${listId}`);
                } else {
                    req.redirect(`/lists/${listId}`);
                }
            });
        } else {
            req.flash("notice", "You do not have access to edit this item.");
            req.redirect("/lists");
        }
    }
}