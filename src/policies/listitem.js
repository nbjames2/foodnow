const ApplicationPolicy = require("./application");

module.exports = class ListItemPolicy extends ApplicationPolicy {
 
    new() {
        console.log(record.userId);
        return this._hasAccess();
    }
    
    create() {
        return this.new();
    }
    
    edit() {
        return this.new();
    }
    
    update() {
        return this.new();
    }
    
    destroy() {
        return this.new();
    }
}
