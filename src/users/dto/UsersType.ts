import { ObjectId } from "mongodb";


export type UsersType = {
    _id: ObjectId;
    id: string;
    login: string;
    email: string;
    createdAt: string;
    accountData: {
        passwordHash: string;
        passwordSalt: string;
    };
    emailConfirmation: {
        codeForActivated: string;
        activatedStatus: boolean;
    };
    recoveryPasswordInformation?: {
        codeForRecovery: string;
        createdDateRecoveryCode: string;
    };
    banInfo?: {
        isBanned: boolean,
        banDate: string,
        banReason: string
    }
};
