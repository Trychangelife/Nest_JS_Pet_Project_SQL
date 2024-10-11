import { Injectable } from "@nestjs/common"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType } from "src/utils/types"
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType"
import { UsersType } from "src/users/dto/UsersType"
import { UsersRepository } from "src/users/repositories/users.repository"
import { uuid } from "uuidv4"



@Injectable()
export class AuthService {

    constructor (protected usersRepository: UsersRepository) {

    }

    async ipAddressIsScam (ip: string, login: string): Promise <boolean> {
        return await this.usersRepository.ipAddressIsScam(ip, login)
    }
    async refreshActivationCode (email: string): Promise <UsersType | null> {
        const refreshCode = uuid()
        return await this.usersRepository.refreshActivationCode(email, refreshCode)
    }
    async counterAttemptAuth (ip: string, login: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptAuth(ip, login)
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
    async informationAboutAuth (ip: string, login: string): Promise <boolean> {
        const authData: AuthDataType = {
            ip,
            tryAuthDate: new Date(),
            login
        }
        return await this.usersRepository.informationAboutAuth(authData)
    }
    async informationAboutConfirmed (ip: string, code: string): Promise <boolean> {
        const confirmationData: ConfirmedAttemptDataType = {
            ip,
            tryConfirmDate: new Date(),
            code
        }
        return await this.usersRepository.informationAboutConfirmed(confirmationData)
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