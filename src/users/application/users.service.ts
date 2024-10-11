import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import { EmailService } from "../../email/email.service"
import { RegistrationDataType } from "../../utils/types"
import { UsersType } from "src/users/dto/UsersType"
import { UsersRepository } from "../repositories/users.repository"
import { v4 as uuidv4 } from "uuid"
import { User } from "../dto/UserClass"

@Injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository, protected emailService: EmailService){
    }
    async allUsers(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string, searchEmailTerm: string, searchLoginTerm: string): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await this.usersRepository.allUsers(skip, pageSize, sortDirection, sortBy ,pageNumber, searchEmailTerm, searchLoginTerm)
    }
    async createNewPassword(password: string, recoveryCode: string): Promise <null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        return await this.usersRepository.createNewPassword(passwordHash, passwordSalt, recoveryCode)
    }
    async createUser(password: string, login: string,  email: string, ip: string): Promise<UsersType | null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        // Построено на классе
        const newUser = new User(new ObjectId(), uuidv4(),login, email, (new Date()).toISOString(), { passwordHash, passwordSalt}, {codeForActivated: uuidv4(), activatedStatus: false})
        const registrationData: RegistrationDataType = {
            ip,
            dateRegistation: new Date(), 
            email
        }
        await this.usersRepository.informationAboutRegistration(registrationData)
        const checkScam = await this.usersRepository.ipAddressIsScam(ip)
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(login) !== null || await this.usersRepository.findUserByEmail(email) !== null ) {
                return false
            }
            else {  
                const createdUser = await this.usersRepository.createUser(newUser)
                this.emailService.emailConfirmation(newUser.email)
                return createdUser
            }
        } 
        return null
    }
    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    async checkCredentials(login: string, password: string,) {
        const user = await this.usersRepository.findUserByLogin(login)
        const user2 = await this.usersRepository.findUserByEmail(login)
        if (!user && !user2) return false
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return true
    }
    async findUserById(id: string): Promise<UsersType | null> {
        return await this.usersRepository.findUserById(id)
    }
    async confirmationEmail(code: string): Promise<boolean> {
        let user = await this.usersRepository.findUserByConfirmationCode(code)
        if (user) {
            return await this.usersRepository.confirmationEmail(user)
        }
        else {
            return false
        }

    }
    async passwordRecovery(email: string): Promise<boolean> {
        const foundUser = await this.usersRepository.findUserByEmail(email)
        if (foundUser !== null) {
            const codeRecoveryPassword = uuidv4()
            return await this.usersRepository.passwordRecovery(email, codeRecoveryPassword)
        }
        else {
            return false
        }
        
    }
}