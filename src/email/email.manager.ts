import { Injectable } from "@nestjs/common"
import { UsersType } from "src/users/dto/UsersType"
import { EmailAdapter } from "./email.adapter"


@Injectable()
export class EmailManager  {
    constructor (private emailAdapter: EmailAdapter) {}

    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = `${process.env.HOSTING_URL}/auth/registration-confirmation`
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${url}?code=${user.emailConfirmation.codeForActivated}'>complete registration</a>
        </p>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
    async sendEmailRecoveryPassword (user: UsersType): Promise<object> {
        const url = `${process.env.HOSTING_URL}/auth/password-recovery`
        const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='${url}?recoveryCode=${user.recoveryPasswordInformation.codeForRecovery}'>recovery password</a>
        </p>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Password recovery')
    }
}