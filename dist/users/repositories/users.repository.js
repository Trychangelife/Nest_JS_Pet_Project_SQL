"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = require("mongoose");
const db_1 = require("../../db");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const userViewModel = {
    _id: 0,
    id: 1,
    email: 1,
    login: 1,
    createdAt: 1,
};
const userViewModelForMe = {
    _id: 0,
    id: 1,
    login: 1,
    email: 1
};
const aggregate = db_1.usersModel.aggregate([
    {
        "$project": { "_id": 0, "userId": "$id", "login": 1, "email": 1 }
    }
]);
let UsersRepository = class UsersRepository {
    constructor(usersModel, registrationDataModel, authDataModel, codeConfirmModel, emailSendModel, refreshTokenModel, recoveryPasswordModel, newPasswordModel) {
        this.usersModel = usersModel;
        this.registrationDataModel = registrationDataModel;
        this.authDataModel = authDataModel;
        this.codeConfirmModel = codeConfirmModel;
        this.emailSendModel = emailSendModel;
        this.refreshTokenModel = refreshTokenModel;
        this.recoveryPasswordModel = recoveryPasswordModel;
        this.newPasswordModel = newPasswordModel;
    }
    async allUsers(skip, limit, sortDirection = 'desc', sortingParam = 'createdAt', page, searchLoginTerm = '', searchEmailTerm = '') {
        const query = {};
        if (searchEmailTerm) {
            const emailQuery = { email: { $regex: searchEmailTerm, $options: 'i' } };
            query.$or = [Object.assign({}, emailQuery)];
        }
        if (searchLoginTerm) {
            const loginQuery = { login: { $regex: searchLoginTerm, $options: 'i' } };
            query.$or = query.$or ? [...query.$or, loginQuery] : [loginQuery];
        }
        const sortValue = sortDirection === 'asc' ? 1 : -1;
        const options = {
            sort: { [sortingParam]: sortValue },
            limit: limit,
            skip: skip,
        };
        const fullData = await this.usersModel.find(query, userViewModel)
            .sort({ [sortingParam]: sortValue })
            .limit(limit)
            .skip(skip)
            .exec();
        const totalCount = await this.usersModel.countDocuments(query);
        const pagesCount = Math.ceil(totalCount / limit);
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: totalCount,
            items: fullData,
        };
    }
    async createUser(newUser) {
        await this.usersModel.create(newUser);
        const checkUniqueLogin = await this.usersModel.countDocuments({ login: newUser.login });
        const checkUniqueEmail = await this.usersModel.countDocuments({ email: newUser.email });
        if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
            return false;
        }
        else {
            const createdUser = await this.usersModel.findOne({ id: newUser.id }, userViewModel).lean();
            return createdUser;
        }
    }
    async createNewPassword(passwordHash, passwordSalt, recoveryCode) {
        const activatedUser = await this.usersModel.updateOne({ "recoveryPasswordInformation.codeForRecovery": recoveryCode }, { $set: { "accountData.passwordHash": passwordHash, "accountData.passwordSalt": passwordSalt } });
        if (activatedUser.modifiedCount > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    async deleteUser(id) {
        const result = await this.usersModel.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
    async confirmationEmail(user, code) {
        const activatedUser = await this.usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } });
        if (activatedUser.modifiedCount > 0) {
            await this.usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.codeForActivated": code } });
            return true;
        }
        else {
            return false;
        }
    }
    async ipAddressIsScam(ip, login) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 10
        });
        const checkResultByIp = await this.registrationDataModel.countDocuments({ $and: [{ ip: ip }, { dateRegistation: { $gt: dateResult } }] });
        if (checkResultByIp > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async counterAttemptAuth(ip, login) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 10
        });
        const checkResultByIp = await this.authDataModel.countDocuments({ $and: [{ ip: ip }, { tryAuthDate: { $gt: dateResult } }] });
        const checkResultByLogin = await this.authDataModel.countDocuments({ $and: [{ login: login }, { tryAuthDate: { $gt: dateResult } }] });
        if (checkResultByIp > 5 || checkResultByLogin > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async counterAttemptConfirm(ip, code) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 10
        });
        const checkResultByIp = await this.codeConfirmModel.countDocuments({ $and: [{ ip: ip }, { tryConfirmDate: { $gt: dateResult } }] });
        if (checkResultByIp > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async counterAttemptEmail(ip, email) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 15
        });
        const checkResultByIp = await this.emailSendModel.countDocuments({ $and: [{ ip: ip, email: email }, { emailSendDate: { $gt: dateResult } }] });
        if (checkResultByIp > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async counterAttemptRecoveryPassword(ip, email) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 10
        });
        const checkResultByIp = await this.recoveryPasswordModel.countDocuments({ $and: [{ ip: ip, email: email }, { emailSendDate: { $gt: dateResult } }] });
        if (checkResultByIp > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async counterAttemptNewPassword(ip, code) {
        const dateResult = (0, date_fns_1.sub)(new Date(), {
            seconds: 10
        });
        const checkResultByIp = await this.newPasswordModel.countDocuments({ $and: [{ ip: ip }, { timestampNewPassword: { $gt: dateResult } }] });
        if (checkResultByIp > 5) {
            return false;
        }
        else {
            return true;
        }
    }
    async passwordRecovery(email, codeRecoveryPassword) {
        await this.usersModel.updateOne({ email: email }, { $set: { "recoveryPasswordInformation.codeForRecovery": codeRecoveryPassword, "recoveryPasswordInformation.createdDateRecoveryCode": new Date() } });
        return true;
    }
    async findUserByEmail(email) {
        const foundUser = await this.usersModel.findOne({ email: email }).lean();
        return foundUser;
    }
    async findUserById(userId) {
        const foundUserById = await this.usersModel.findOne({ id: userId }).lean();
        return foundUserById;
    }
    async findUserByLogin(login, description) {
        if (description === "full") {
            return await this.usersModel.findOne({ login: login });
        }
        const foundUser = await this.usersModel.findOne({ login: login }).lean();
        return foundUser;
    }
    async findUserByLoginForMe(login) {
        const foundUser2 = await this.usersModel.aggregate([
            { $match: { login: login } },
            { $project: { _id: 0, userId: "$id", email: 1, login: 1 } }
        ]);
        return foundUser2[0];
    }
    async findUserByConfirmationCode(code) {
        const foundUser = await this.usersModel.findOne({ "emailConfirmation.codeForActivated": code }).lean();
        return foundUser;
    }
    async refreshActivationCode(email, code) {
        const updateCode = await this.usersModel.findOneAndUpdate({ email: email }, { $set: { "emailConfirmation.codeForActivated": code } }, { new: true });
        return updateCode;
    }
    async getRegistrationDate() {
        return await this.registrationDataModel.find({});
    }
    async getAuthDate() {
        return await this.authDataModel.find({});
    }
    async getEmailSendDate() {
        return await this.emailSendModel.find({});
    }
    async getConfirmAttemptDate() {
        return await this.codeConfirmModel.find({});
    }
    async getTokenDate() {
        return await this.refreshTokenModel.find({});
    }
    async informationAboutRegistration(registrationData) {
        await this.registrationDataModel.create(registrationData);
        return true;
    }
    async informationAboutAuth(authData) {
        await this.authDataModel.create(authData);
        return true;
    }
    async informationAboutEmailSend(emailSendData) {
        await this.emailSendModel.create(emailSendData);
        return true;
    }
    async informationAboutConfirmed(confirmedData) {
        await this.codeConfirmModel.create(confirmedData);
        return true;
    }
    async informationAboutPasswordRecovery(recoveryPasswordData) {
        await this.recoveryPasswordModel.create(recoveryPasswordData);
        return true;
    }
    async informationAboutNewPassword(recoveryNewPasswordData) {
        await this.newPasswordModel.create(recoveryNewPasswordData);
        return true;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Users')),
    __param(1, (0, mongoose_2.InjectModel)('RegistrationData')),
    __param(2, (0, mongoose_2.InjectModel)('AuthData')),
    __param(3, (0, mongoose_2.InjectModel)('CodeConfirm')),
    __param(4, (0, mongoose_2.InjectModel)('EmailSend')),
    __param(5, (0, mongoose_2.InjectModel)('RefreshToken')),
    __param(6, (0, mongoose_2.InjectModel)('RecoveryPassword')),
    __param(7, (0, mongoose_2.InjectModel)('NewPassword')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map