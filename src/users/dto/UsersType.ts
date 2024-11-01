

export type UsersType = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    password_hash: string;
    password_salt: string;
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


export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}
