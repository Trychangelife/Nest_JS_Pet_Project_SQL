import { UsersType } from "src/users/dto/UsersType";
import { EmailAdapter } from "./email.adapter";
export declare class EmailManager {
    private emailAdapter;
    constructor(emailAdapter: EmailAdapter);
    sendEmailConfirmation(user: UsersType): Promise<object>;
    sendEmailRecoveryPassword(user: UsersType): Promise<object>;
}
