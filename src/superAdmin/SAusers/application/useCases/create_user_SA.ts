import { CommandHandler } from "@nestjs/cqrs"
import { EmailService } from "src/email/email.service"
import { UsersType } from "src/users/dto/UsersType"
import { RegistrationDataType } from "src/utils/types"
import * as bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import { User } from "src/users/dto/UserClass"
import { v4 as uuidv4 } from "uuid"
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository"

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
    constructor (protected usersRepository: SuperAdminUsersRepository, protected emailService: EmailService ) {}

    async execute(command: CreateUserSACommand): Promise<UsersType | null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(command.password, passwordSalt)
        // Построено на классе
        const newUser = new User(
            new ObjectId(), 
            uuidv4(),command.login, 
            command.email, (new Date()).toISOString(), 
            { passwordHash, passwordSalt}, 
            {codeForActivated: uuidv4(), activatedStatus: false}, 
            {codeForRecovery: null, createdDateRecoveryCode: null},
            {isBanned: false, banDate: null, banReason: null})

        const registrationData: RegistrationDataType = {
            ip: command.ip,
            dateRegistation: new Date(), 
            email: command.email
        }
        //await this.usersRepository.informationAboutRegistration(registrationData)
        const checkScam = await this.usersRepository.ipAddressIsScam(command.ip)
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(command.login) !== null || await this.usersRepository.findUserByEmail(command.email) !== null ) {
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
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}


