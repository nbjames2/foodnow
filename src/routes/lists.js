const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/lists", listController.index);
router.get("/lists/new", listController.newListForm);
router.post("/lists/new", helper.ensureAuthenticated, validation.validateList, listController.create);
router.get("/lists/:id", listController.viewList);
router.get("/lists/:id/newItem", listController.newItemForm);
router.post("/lists/:id/newItem", helper.ensureAuthenticated, validation.validateItem, listController.createItem);
router.get("/lists/:id/edit/:itemId", listController.editView);
router.post("/lists/:id/edit/:itemId", helper.ensureAuthenticated, validation.validateItem, listController.edit);
router.post("/lists/:id/access", helper.ensureAuthenticated, validation.validateAccess, listController.createAccess);
router.get("/lists/:id/destroy", helper.ensureAuthenticated, listController.deleteList);
router.get("/lists/:id/purchased/:itemId", listController.purchase);
router.get("/lists/:id/destroy/:itemId", helper.ensureAuthenticated, listController.deleteItem);

module.exports = router;