
import { sub } from "date-fns"
import { Model } from "mongoose"
import { usersModel } from "../../db"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType } from "../../utils/types"
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType"
import { UsersType } from "src/users/dto/UsersType"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"

const userViewModel = {
    _id: 0,
    id: 1,
    email: 1,
    login: 1 ,
    createdAt: 1,
}
const userViewModelForMe = {
_id: 0,
id: 1,
login: 1,
email: 1
}

const aggregate = usersModel.aggregate([
    {
        "$project": {"_id": 0, "userId": "$id", "login": 1, "email": 1}
    }
    ])
    
@Injectable()
export class UsersRepository {

    constructor (
        @InjectModel('Users') public usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') protected registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') protected authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') protected codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') protected emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        @InjectModel('RecoveryPassword') protected recoveryPasswordModel: Model<RecoveryPasswordType>,
        @InjectModel('NewPassword') protected newPasswordModel: Model<NewPasswordType>
    ) {

    }
    async allUsers(
        skip: number,
        limit: number,
        sortDirection: string = 'desc',  // Значение по умолчанию
        sortingParam: string = 'createdAt',  // Значение по умолчанию
        page: number,
        searchLoginTerm: string = '',
        searchEmailTerm: string = ''
      ): Promise<object> {
        // Условия поиска для FIND в MongoDB
        const query: any = {};
      
        // Если указан searchEmailTerm, добавляем условие поиска по email
        if (searchEmailTerm) {
          const emailQuery = { email: { $regex: searchEmailTerm, $options: 'i' } };
          query.$or = [{ ...emailQuery }];
        }
      
        // Если указан searchLoginTerm, добавляем условие поиска по login
        if (searchLoginTerm) {
          const loginQuery = { login: { $regex: searchLoginTerm, $options: 'i' } };
          // Объединяем с существующим условием $or, если оно есть
          query.$or = query.$or ? [...query.$or, loginQuery] : [loginQuery];
        }
      
        // Преобразуем sortDirection в числовое значение
        const sortValue = sortDirection === 'asc' ? 1 : -1;
      
        // Опции для сортировки и пагинации
        const options = {
          sort: { [sortingParam]: sortValue },  // Применение сортировки
          limit: limit,
          skip: skip,
        };
      
        // Выполняем запрос с учетом поиска, сортировки и лимитов
        const fullData = await this.usersModel.find(query, userViewModel)
          .sort({ [sortingParam]: sortValue })
          .limit(limit)
          .skip(skip)
          .exec();
      
        // Подсчет общего количества документов с учетом поиска
        const totalCount = await this.usersModel.countDocuments(query);
        const pagesCount = Math.ceil(totalCount / limit);
      
        // Возвращаем результаты в формате пагинации
        return {
          pagesCount: pagesCount,
          page: page,
          pageSize: limit,
          totalCount: totalCount,
          items: fullData,
        };
      }
async createUser(newUser: UsersType): Promise<UsersType | null | boolean> {
    await this.usersModel.create(newUser)
    const checkUniqueLogin = await this.usersModel.countDocuments({ login: newUser.login })
    const checkUniqueEmail = await this.usersModel.countDocuments({ email: newUser.email })
    if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
        return false
    }
    else {
        const createdUser = await this.usersModel.findOne({ id: newUser.id }, userViewModel).lean()
        return createdUser
    }

}
async createNewPassword(passwordHash: string, passwordSalt: string ,recoveryCode: string): Promise <null | boolean> {
    // Сюда еще проверку времени кода прилепить
    const activatedUser = await this.usersModel.updateOne({ "recoveryPasswordInformation.codeForRecovery": recoveryCode }, { $set: { "accountData.passwordHash": passwordHash, "accountData.passwordSalt": passwordSalt } })
    if (activatedUser.modifiedCount > 0) {
        return true
    }
    else {
        return false
    }
}
async deleteUser(id: string): Promise<boolean> { 
    const result = await this.usersModel.deleteOne({ id: id })
    return result.deletedCount === 1
}

// Основная часть закончена, вспомогательные эндпоинты
async confirmationEmail(user: UsersType, code?: string): Promise<boolean> {
    const activatedUser = await this.usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } })
    if (activatedUser.modifiedCount > 0) {
        await this.usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.codeForActivated": code } })

        return true
    }
    else {
        return false
    }
}
async ipAddressIsScam(ip: string, login?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10 // Задержка которую мы отнимаем от текущего времени
    })
    const checkResultByIp = await this.registrationDataModel.countDocuments({ $and: [{ ip: ip }, { dateRegistation: { $gt: dateResult } }] })
    if (checkResultByIp > 5) { // Проверяем длинну массива, если больше 5 регистраций, то отдаем false - он дальше отдает 429 ошибку
        return false
    }
    else { return true }
}

// Считаем количество авторизаций с учетом IP и Login за последние 10 секунд
async counterAttemptAuth(ip: string, login?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.authDataModel.countDocuments({ $and: [{ ip: ip }, { tryAuthDate: { $gt: dateResult } }] })
    const checkResultByLogin = await this.authDataModel.countDocuments({ $and: [{ login: login }, { tryAuthDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5 || checkResultByLogin > 5) {
        return false
    }
    else { return true }
}
async counterAttemptConfirm(ip: string, code?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.codeConfirmModel.countDocuments({ $and: [{ ip: ip }, { tryConfirmDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { 
        return true 
    }
}
async counterAttemptEmail(ip: string, email?: string): Promise<boolean> {
    //Здесь 15 сек т.к отправка Email может занимать длительное время и 5 запросов не успевают за 10 сек.
    const dateResult = sub(new Date(), {
        seconds: 15
    })
    const checkResultByIp = await this.emailSendModel.countDocuments({ $and: [{ ip: ip, email: email }, { emailSendDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { return true }
}
async counterAttemptRecoveryPassword(ip: string, email?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.recoveryPasswordModel.countDocuments({ $and: [{ ip: ip, email: email }, { emailSendDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { return true }
}
async counterAttemptNewPassword(ip: string, code?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.newPasswordModel.countDocuments({ $and: [{ ip: ip}, { timestampNewPassword: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { return true }
}
async passwordRecovery(email: string, codeRecoveryPassword: string): Promise<boolean> {
    await this.usersModel.updateOne({ email: email }, { $set: { "recoveryPasswordInformation.codeForRecovery": codeRecoveryPassword, "recoveryPasswordInformation.createdDateRecoveryCode": new Date() } })
    return true
}

// Эндпоинты для поиска по определенным условиям
async findUserByEmail(email: string): Promise<UsersType | null> {
    const foundUser = await this.usersModel.findOne({ email: email }).lean()
    return foundUser
}
async findUserById(userId: string): Promise<UsersType | null> {
    const foundUserById = await this.usersModel.findOne({id: userId}).lean()
    return foundUserById
}
async findUserByLogin(login: string, description?: string): Promise<UsersType | null> {
    if (description === "full"){ return await this.usersModel.findOne({login: login})}
    const foundUser: UsersType = await this.usersModel.findOne({ login: login }).lean()
    return foundUser
}


async findUserByLoginForMe(login: string ): Promise<any[] | UsersType> {
    const foundUser2 = await this.usersModel.aggregate([
        {$match: {login: login}},
        {$project: {_id: 0, userId: "$id", email: 1, login: 1}}
    ])
    //const foundUser = await this.usersModel.findOne({ login: login }).lean()
    return foundUser2[0]
    //return foundUser
}
async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
    const foundUser = await this.usersModel.findOne({ "emailConfirmation.codeForActivated": code }).lean()
    return foundUser
}
async refreshActivationCode(email: string, code: string): Promise <UsersType | null> {
    const updateCode = await this.usersModel.findOneAndUpdate({ email: email }, { $set: { "emailConfirmation.codeForActivated": code } }, { new: true })
    return updateCode
}

// Эндпоинты для выгрузки информации из вспомогательных лог-баз
async getRegistrationDate(): Promise<RegistrationDataType[]> {
    return await this.registrationDataModel.find({})
}
async getAuthDate(): Promise<AuthDataType[]> {
    return await this.authDataModel.find({})
}
async getEmailSendDate(): Promise<EmailSendDataType[]> {
    return await this.emailSendModel.find({})
}
async getConfirmAttemptDate(): Promise<ConfirmedAttemptDataType[]> {
    return await this.codeConfirmModel.find({})
}
async getTokenDate(): Promise<RefreshTokenStorageType[]> {
    return await this.refreshTokenModel.find({})
}

// Эндпоинты для наполнения информацией вспомогательных лог-баз
async informationAboutRegistration(registrationData: RegistrationDataType): Promise<boolean> {
    await this.registrationDataModel.create(registrationData)
    return true
}
async informationAboutAuth(authData: AuthDataType): Promise<boolean> {
    await this.authDataModel.create(authData)
    return true
}
async informationAboutEmailSend(emailSendData: EmailSendDataType): Promise<boolean> {
    await this.emailSendModel.create(emailSendData)
    return true
}
async informationAboutConfirmed(confirmedData: ConfirmedAttemptDataType): Promise<boolean> {
    await this.codeConfirmModel.create(confirmedData)
    return true
}
async informationAboutPasswordRecovery(recoveryPasswordData: RecoveryPasswordType): Promise<boolean> {
    await this.recoveryPasswordModel.create(recoveryPasswordData)
    return true
}
async informationAboutNewPassword(recoveryNewPasswordData: NewPasswordType): Promise<boolean> {
    await this.newPasswordModel.create(recoveryNewPasswordData)
    return true
}
}