module.exports = class ApplicationPolicy {
     constructor(user, record, access) {
       this.user = user;
       this.record = record;
       this.access = access;
     }

     _isOwner() {
        return this.record && (this.record.userId == this.user.id);
     }
   
     _hasAccess() {
         return this.record && (this.access.userId == this.user.id);
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
            this.record && (this._isOwner() || this._hasAccess());
     }
   
     update() {
       return this.edit();
     }
   
     destroy() {
       return this.edit();
     }
   }