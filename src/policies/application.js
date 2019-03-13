module.exports = class ApplicationPolicy {
     constructor(user, record) {
       this.user = user;
       this.record = record;
     }

     _isOwner() {
        return this.record && (this.record.userId == this.user.id);
     }

     new() {
        return this.user != null;
     }
   
     create() {
        return this.new();
     }
   
     show() {
        return true;
     }
   
     edit() {
        return this.new() &&
            this.record && (this._isOwner());
     }
   
     update() {
       return this.edit();
     }
   
     destroy() {
       return this.edit();
     }
   }