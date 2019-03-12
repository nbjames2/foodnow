const listqueries = require("../../db/queries.lists");
const ejs = require("ejs");

module.exports = {
    checkboxClicked(itemId, listId) {
        listqueries.updatePurchase(itemId, (err, item) => {
            if(err) {
                console.log(err);
            } else {
                console.log(item.purchased);
                ejs.render("lists/list", {itemId, listId});
            }
        });
    }
}