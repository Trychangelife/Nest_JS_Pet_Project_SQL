export type RecoveryPasswordType = {
    ip: string;
    emailSendDate: Date;
    email: string;
};
export type NewPasswordType = {
    ip: string;
    recoveryCode: string;
    timestampNewPassword: Date;
};
