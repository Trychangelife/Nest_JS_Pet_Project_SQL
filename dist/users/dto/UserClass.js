"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(_id, id, login, email, createdAt, accountData, emailConfirmation, recoveryPasswordInformation, banInfo) {
        this._id = _id;
        this.id = id;
        this.login = login;
        this.email = email;
        this.createdAt = createdAt;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
        this.recoveryPasswordInformation = recoveryPasswordInformation;
        this.banInfo = banInfo;
    }
}
exports.User = User;
//# sourceMappingURL=UserClass.js.map