import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { EmailService } from "src/email/email.service"
import { UsersType, userViewModel } from "src/users/dto/UsersType"
import { v4 as uuidv4 } from "uuid"
import { User } from "../dto/UserClass"
import { UsersRepository } from "../repositories/users.repository"
import { SuperAdminUsersRepositorySql } from "src/superAdmin/SAusers/repositories/SuperAdmin.user.repositorySQL"
import { UserEntity } from "src/entities/users/user.entity"

@Injectable()
export class UsersService {

    constructor(protected usersRepository: SuperAdminUsersRepositorySql, protected emailService: EmailService){
    }
    async allUsers(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string, searchEmailTerm: string, searchLoginTerm: string): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await this.usersRepository.allUsers(skip, pageSize, sortDirection, sortBy ,pageNumber, searchEmailTerm, searchLoginTerm, null)
    }
    async createNewPassword(password: string, recoveryCode: string): Promise <null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        return await this.usersRepository.createNewPassword(passwordHash, passwordSalt, recoveryCode)
    }
    async createUser(password: string, login: string,  email: string, ip: string): Promise<userViewModel | null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        // Построено на классе
        const newUser = new User( uuidv4(),login, email, (new Date()).toISOString(), passwordHash, passwordSalt, {codeForActivated: uuidv4(), activatedStatus: false})
        const checkScam = true
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(login)  || await this.usersRepository.findUserByEmail(email) ) {
                return false
            }
            else {  
                const createdUser = await this.usersRepository.createUser(newUser)
                this.emailService.emailConfirmation(newUser.email) // Отвечает за рассылку кода
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
        // const user = await this.usersRepository.findUserByLogin(login)
        //const user2 = await this.usersRepository.findUserByEmail(login)
        const userHash = await this.usersRepository.findUserHash(login)
        if (!userHash) return false
        const passwordHash = await this._generateHash(password, userHash.password_salt)
        if (userHash.password_hash !== passwordHash) {
            return false
        }
        return true
    }
    async findUserById(id: string): Promise<UserEntity | null> {
        return await this.usersRepository.findUserById(id)
    }
    async confirmationEmail(code: string): Promise<boolean> {
        let user = await this.usersRepository.findUserByConfirmationCode(code)
        let userCode: string | null = await this.usersRepository.findCode(code)
        if (user && userCode) {
            return await this.usersRepository.confirmationEmail(user.id.toString(), userCode)
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