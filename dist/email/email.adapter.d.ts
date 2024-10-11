import { MailerService } from "@nest-modules/mailer";
export declare class EmailAdapter {
    private mailerService;
    constructor(mailerService: MailerService);
    sendEmailConfirmation(email: string, message: string, subject: string): Promise<object>;
}
