import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersType } from "src/users/dto/UsersType";
import { EmailManager } from "./email.manager";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class EmailService {
    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        private emailManager: EmailManager,
    ) {}

    async emailConfirmation(email: string): Promise<object | boolean> {
        const foundUser = await this.findUserByEmail(email);
        if (!foundUser) return false;

        const codeForActivated = await this.getCodeForActivation(foundUser.id);
        const isAccountInactive = await this.isAccountInactive(foundUser.id.toString());

        if (isAccountInactive) {
            return  this.emailManager.sendEmailConfirmation(foundUser, codeForActivated);
        }

        return false;
    }

    async emailPasswordRecovery(email: string): Promise<object | boolean> {
        const foundUser = await this.findUserByEmail(email);
        if (!foundUser) return false;

        const codeForRecovery = await this.getCodeForRecovery(foundUser.id);
        const isAccountInactive = await this.isAccountInactive(foundUser.id.toString());

        if (isAccountInactive) {
            return this.emailManager.sendEmailRecoveryPassword(foundUser, codeForRecovery);
        }

        return false;
    }

    private async findUserByEmail(email: string): Promise<UsersType | null> {
        const users = await this.dataSource.query(`
            SELECT *
            FROM users
            WHERE email = $1
        `, [email]);
        return users.length > 0 ? users[0] : null;
    }

    private async getCodeForActivation(userId: string): Promise<string | null> {
        const codes = await this.dataSource.query(`
            SELECT code_for_activated
            FROM email_confirmation
            WHERE user_id = $1
        `, [userId]);
        return codes.length > 0 ? codes[0].code_for_activated : null;
    }

    private async getCodeForRecovery(userId: string): Promise<string | null> {
        const codes = await this.dataSource.query(`
            SELECT code_for_activated
            FROM recovery_password_info
            WHERE user_id = $1
        `, [userId]);
        return codes.length > 0 ? codes[0].code_for_activated : null;
    }

    private async isAccountInactive(id: string): Promise<boolean> {
        const statusAccount = await this.dataSource.query(`
            SELECT *
            FROM email_confirmation
            WHERE activated_status = 'false' AND user_id = $1
        `, [id]);
        return statusAccount.length > 0;
    }
}
