import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { PayloadType, RefreshTokenStorageType } from "src/utils/types";
import { UsersType } from "src/users/dto/UsersType";
import { uuid } from "uuidv4";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class JwtServiceClass {

    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        protected jwtService: JwtService
    ) {}

    async accessToken(user: UsersType) {
        return this.jwtService.sign(
            { id: user.id }, 
            { secret: process.env.JWT_SECRET, expiresIn: '10m' }
        );
    }

    async refreshToken(user: UsersType, ip: string, titleDevice: string, rToken?: string): Promise<string> {
        // Создаем QueryRunner для выполнения транзакций
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        // Проверяем наличие устройства для пользователя
        const [checkUserAgent] = await this.dataSource.query(`
            SELECT * FROM refresh_token_storage
            WHERE user_id = $1 AND title = $2
        `, [user.id, titleDevice]);

        // Проверка наличия самого RefreshToken
        const [checkToken] = rToken ? await this.dataSource.query(`
            SELECT * FROM refresh_token_storage
            WHERE refresh_token = $1
        `, [rToken]) : [null];

        // Если устройство уже зарегистрировано, обновляем токен
        if (checkUserAgent) {
            const deviceId = checkUserAgent.device_id;
            const refreshToken = this.jwtService.sign(
                { id: user.id, deviceId: deviceId },
                { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m' }
            );

            await this.dataSource.query(`
                UPDATE refresh_token_storage
                SET last_activate_date=$1, refresh_token=$2
                WHERE user_id=$3 AND device_id=$4
            `, [new Date(), refreshToken, user.id, deviceId]);
            return refreshToken;
        }

        // Если пришел refresh token и он не зарегистрирован, выбрасываем ошибку
        if (rToken && !checkToken) {
            throw new Error("Invalid refresh token");
        }

        // Регистрируем новое устройство и токен
        const deviceId = uuid();
        const refreshToken = this.jwtService.sign(
            { id: user.id, deviceId: deviceId },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m' }
        );

        const newRefreshTokenForStorage: RefreshTokenStorageType = {
            userId: user.id,
            refreshToken: refreshToken,
            ip: ip,
            title: titleDevice,
            lastActiveDate: new Date(),
            deviceId: deviceId
        };

        await this.dataSource.query(`
            INSERT INTO refresh_token_storage 
            (user_id, refresh_token, ip, title, device_id, last_activate_date)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [newRefreshTokenForStorage.userId, newRefreshTokenForStorage.refreshToken, newRefreshTokenForStorage.ip, newRefreshTokenForStorage.title, newRefreshTokenForStorage.deviceId, newRefreshTokenForStorage.lastActiveDate]);

        return refreshToken;
    }

    async getUserByAccessToken(token: string) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            return result.id;
        } catch (error) {
            return null;
        }
    }

    async getUserByRefreshToken(token: string) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            return result.id;
        } catch (error) {
            return null;
        }
    }

    async getNewAccessToken(rToken: string, ip: string, titleDevice: string): Promise<object | null> {
        const [checkToken] = await this.dataSource.query(`
            SELECT * FROM refresh_token_storage
            WHERE refresh_token = $1
        `, [rToken]);

        if (checkToken) {
            try {
                const result = this.jwtService.verify(checkToken.refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
                const newAccessToken = await this.accessToken(result);
                const newRefreshToken = await this.refreshToken(result, ip, titleDevice, rToken);
                return { newAccessToken, newRefreshToken };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    async checkRefreshToken(refreshToken: string): Promise<boolean | object> {
        try {
            const result = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
            return { token: result };
        } catch (error) {
            return false;
        }
    }

    async getJwtPayload(refreshToken: string): Promise<PayloadType> {
        const tokenParts = refreshToken.split('.');
        const payloadString = Buffer.from(tokenParts[1], 'base64').toString('utf-8');
        return JSON.parse(payloadString) as PayloadType;
    }
}
