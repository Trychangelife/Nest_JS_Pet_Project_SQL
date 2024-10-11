import { ObjectId } from "mongodb";
export declare class User {
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
        isBanned: boolean;
        banDate: string;
        banReason: string;
    };
    constructor(_id: ObjectId, id: string, login: string, email: string, createdAt: string, accountData: {
        passwordHash: string;
        passwordSalt: string;
    }, emailConfirmation: {
        codeForActivated: string;
        activatedStatus: boolean;
    }, recoveryPasswordInformation?: {
        codeForRecovery: string;
        createdDateRecoveryCode: string;
    }, banInfo?: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
    });
}
