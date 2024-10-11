import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { UsersType } from "src/users/dto/UsersType"
import { EmailManager } from "./email.manager"

@Injectable()
export class EmailService {

    constructor (
        @InjectModel('Users') protected usersModel: Model<UsersType>,
        private emailManager: EmailManager,
    ) {
        
    }

    async emailConfirmation(email: string): Promise<object | boolean> {
        const foundUser = await this.usersModel.findOne({ email: email }).lean()
        const statusAccount = await this.usersModel.findOne({email: email, 'emailConfirmation.activatedStatus': false}).lean()
        if (foundUser !== null && statusAccount !== null) {
            return await this.emailManager.sendEmailConfirmation(foundUser)
        }
        else {
            return false
        } 
    }
    async emailPasswordRecovery(email: string): Promise<object | boolean> {
        const foundUser = await this.usersModel.findOne({ email: email }).lean()
        const statusAccount = await this.usersModel.findOne({email: email, 'emailConfirmation.activatedStatus': false}).lean()
        if (foundUser !== null && statusAccount !== null) {
            return await this.emailManager.sendEmailRecoveryPassword(foundUser)
        }
        else {
            return false
        } 
    }
}