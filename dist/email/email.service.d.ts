import { Model } from "mongoose";
import { UsersType } from "src/users/dto/UsersType";
import { EmailManager } from "./email.manager";
export declare class EmailService {
    protected usersModel: Model<UsersType>;
    private emailManager;
    constructor(usersModel: Model<UsersType>, emailManager: EmailManager);
    emailConfirmation(email: string): Promise<object | boolean>;
    emailPasswordRecovery(email: string): Promise<object | boolean>;
}
