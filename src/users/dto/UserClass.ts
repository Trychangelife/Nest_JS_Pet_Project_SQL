import { ObjectId } from "mongodb";


export class User {
    constructor(
        public _id: ObjectId,
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string,
        public accountData: { passwordHash: string; passwordSalt: string; },
        public emailConfirmation: { codeForActivated: string; activatedStatus: boolean; },
        public recoveryPasswordInformation?: { codeForRecovery: string; createdDateRecoveryCode: string; },
        public banInfo?: {
            isBanned: boolean,
            banDate: string,
            banReason: string
        }) { }
}
