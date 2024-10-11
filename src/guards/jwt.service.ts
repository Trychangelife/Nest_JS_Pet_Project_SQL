
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { JwtService} from '@nestjs/jwt'
import { PayloadType, RefreshTokenStorageType } from "src/utils/types";
import { UsersType } from "src/users/dto/UsersType";
import { uuid } from "uuidv4";
import { deviceView } from "src/security_devices/repostitories/security.repository";


@Injectable()
export class JwtServiceClass {


    constructor (@InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>, protected jwtService: JwtService) {
    }
    
    async accessToken(user: UsersType) {
        const accessToken = this.jwtService.sign({ id: user.id }, {secret: process.env.JWT_SECRET, expiresIn: '10s'})
        return accessToken
    }
    async refreshToken(user: UsersType, ip: string, titleDevice: string, rToken?: string): Promise<string> {
        const checkUserAgent = await this.refreshTokenModel.findOne({userId: user.id, title: titleDevice}).lean()
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken}).lean()
        // Условия если пользователь уже авторизовался с этого устройства и нужно лишь заменить RefreshToken + Сохранить DeviceID
        if (checkUserAgent !== null ) {
            const deviceId = checkUserAgent.deviceId
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s'})
            await this.refreshTokenModel.updateOne({ userId: user.id, deviceId: deviceId }, { $set: { lastActiveDate: new Date (), refreshToken: refreshToken } })
            return refreshToken
        }
        // Если нам отправили refresh token 
        else if (checkToken !== null) {
            const deviceId = checkToken.deviceId
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s'})
            await this.refreshTokenModel.updateOne({ userId: user.id, deviceId: deviceId }, { $set: { lastActiveDate: new Date (), refreshToken: refreshToken } })
            return refreshToken
        }
        else {
            const deviceId = uuid()
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s'})
            const newRefreshTokenForStorage: RefreshTokenStorageType = {
                userId: user.id,
                refreshToken: refreshToken,
                ip: ip,
                title: titleDevice,
                lastActiveDate: new Date(),
                deviceId: deviceId
            }
            await this.refreshTokenModel.create(newRefreshTokenForStorage)
            return refreshToken
        }
    }
    async getUserByAccessToken(token: string) {
        try {
            const result: any = this.jwtService.verify(token, {secret: process.env.JWT_SECRET})
            return result.id
        } catch (error) {
            return null
        }
    }
    async getUserByRefreshToken(token: string) {
        try {
            const result: any = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET})
            return result.id
        } catch (error) {
            return null
        }
    }
    async getNewAccessToken(rToken: string, ip: string, titleDevice: string): Promise<object | null> {
        //const deviceIdForSearch: PayloadType = await this.getJwtPayload(rToken)
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken}).lean()
        if (checkToken !== null) {
            try {
                const result: any = this.jwtService.verify(checkToken.refreshToken, {secret: process.env.JWT_REFRESH_SECRET})
                const newAccessToken = await this.accessToken(result)
                const newRefreshToken =  await this.refreshToken(result, ip, titleDevice, rToken)
                return { newAccessToken, newRefreshToken }
            } catch (error) {
                return null
            }
        }
        else {
            return null
        }

    }
    async checkRefreshToken(refreshToken: string): Promise<boolean | object> {
        try {
            const result = this.jwtService.verify(refreshToken, {secret: process.env.JWT_REFRESH_SECRET})
            return {token: result}
        } catch (error) {
            return false
        }
    }
    // async checkRefreshTokenWithTitle(refreshToken: string, userAgent: string): Promise<boolean | object> {

    //         const result = this.jwtService.verify(refreshToken, {secret: process.env.JWT_REFRESH_SECRET})
    //         const checkToken = await this.refreshTokenModel.findOne({ refreshToken: refreshToken, title: userAgent})
    //         if (result && (checkToken !== null)) {
    //             return {token: result}
    //         }
    //         else {
    //             return false
    //         }
            
    // }
    async getJwtPayload (refreshToken: string): Promise<PayloadType> {
        const tokenParts = refreshToken.split('.');
        const payloadString = Buffer.from(tokenParts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadString);
        return payload
    }
}