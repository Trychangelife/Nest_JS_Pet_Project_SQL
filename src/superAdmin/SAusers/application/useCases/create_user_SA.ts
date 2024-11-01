import { CommandHandler } from "@nestjs/cqrs"
import * as bcrypt from "bcrypt"
import { EmailService } from "src/email/email.service"
import { UserAlreadyExistsException } from "src/exception_filters/UserException"
import { User } from "src/users/dto/UserClass"
import { userViewModel } from "src/users/dto/UsersType"
import { RegistrationDataType } from "src/utils/types"
import { v4 as uuidv4 } from "uuid"
import { SuperAdminUsersRepositorySql } from "../../repositories/SuperAdmin.user.repositorySQL"

export class CreateUserSACommand {
    constructor(
        public password: string, 
        public login: string,  
        public email: string, 
        public ip: string) {
        
    }
}


@CommandHandler(CreateUserSACommand)
export class CreateUserSAUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepositorySql, protected emailService: EmailService ) {}

    async execute(command: CreateUserSACommand): Promise<Object | null > {

        const password_salt = await bcrypt.genSalt(10)
        const password_hash = await this._generateHash(command.password, password_salt)
        // Построено на классе
        const newUser = new User( 
            uuidv4(),command.login, 
            command.email, (new Date()).toISOString(), 
            password_hash, password_salt, 
            {codeForActivated: uuidv4(), activatedStatus: false}, 
            {codeForRecovery: null, createdDateRecoveryCode: null},
            {isBanned: false, banDate: null, banReason: null})

        const registrationData: RegistrationDataType = {
            ip: command.ip,
            dateRegistation: new Date(), 
            email: command.email
        }
        //await this.usersRepository.informationAboutRegistration(registrationData)
        //const checkScam = await this.usersRepository.ipAddressIsScam(command.ip)
        //if (checkScam == true) {
            const findUserByLogin = await this.usersRepository.findUserByLogin(command.login)
            const findUserByEmail = await this.usersRepository.findUserByEmail(command.email)
            if (findUserByLogin) {
                throw new UserAlreadyExistsException('Login', "Login already in use");
              }
            if (findUserByEmail) {
                throw new UserAlreadyExistsException('Email', "Email already in use");
              }
            else {
                const createdUser: userViewModel | null = await this.usersRepository.createUser(newUser)
                //this.emailService.emailConfirmation(newUser.email)
                return createdUser
            }
       //}
       // else {
        //    return null
        //} 
        
    }
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}


