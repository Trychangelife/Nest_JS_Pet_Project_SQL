import { Injectable } from "@nestjs/common"
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType"
import { UsersType } from "src/users/dto/UsersType"
import { UsersRepository } from "src/users/repositories/users.repository"
import { EmailSendDataType } from "src/utils/types"
import { uuid } from "uuidv4"



@Injectable()
export class AuthService {

    constructor (protected usersRepository: UsersRepository) {

    }
    async refreshActivationCode (email: string): Promise <UsersType | null> {
        const refreshCode = uuid()
        const userId = (await this.usersRepository.findUserByEmail(email))?.id
        return await this.usersRepository.refreshActivationCode(userId, refreshCode)
    }
    async counterAttemptConfirm (ip: string, code: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptConfirm(ip, code)
    }
    async counterAttemptEmail (ip: string, email: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptEmail(ip, email)
    }
    async counterAttemptRecoveryPassword (ip: string, email: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptRecoveryPassword(ip, email)
    }
    async counterAttemptNewPassword (ip: string, code: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptNewPassword(ip, code)
    }
    async informationAboutEmailSend (ip: string, email: string): Promise <boolean> {
        const emailSendData: EmailSendDataType = {
            ip,
            emailSendDate: new Date(),
            email
        }
        return await this.usersRepository.informationAboutEmailSend(emailSendData)
    }
    async informationAboutRecoveryPassword (ip: string, email: string): Promise <boolean> {
        const recoveryPasswordData: RecoveryPasswordType = {
            ip,
            emailSendDate: new Date(),
            email
        }
        return await this.usersRepository.informationAboutPasswordRecovery(recoveryPasswordData)
    }
    async informationAboutNewPassword (ip: string, code: string): Promise <boolean> {
        const recoveryNewPasswordData: NewPasswordType = {
            ip,
            timestampNewPassword: new Date(),
            recoveryCode: code
        }
        return await this.usersRepository.informationAboutNewPassword(recoveryNewPasswordData)
    }
}