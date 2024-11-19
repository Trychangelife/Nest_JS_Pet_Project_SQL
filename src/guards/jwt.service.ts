import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { RefreshTokenStorageEntity } from "src/entities/auth/refresh_token_storage.entity";
import { UsersType } from "src/users/dto/UsersType";
import { PayloadType, RefreshTokenStorageType } from "src/utils/types";
import { DataSource, Repository } from "typeorm";
import { uuid } from "uuidv4";

@Injectable()
export class JwtServiceClass {

    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        @InjectRepository(RefreshTokenStorageEntity)
        private readonly refreshTokenStorageRepository: Repository<RefreshTokenStorageEntity>,
        protected jwtService: JwtService
    ) { }

    async accessToken(user: UsersType) {
        return this.jwtService.sign(
            { id: user.id },
            { secret: process.env.JWT_SECRET, expiresIn: '10m' }
        );
    }

    // Только для выпуска первого токена
    async getFirstRefreshToken(user: UsersType, ip: string, titleDevice: string): Promise<string> {

        // Регистрируем новое устройство и токен
        const deviceId = uuid();
        const refreshToken = this.jwtService.sign(
            { id: user.id, deviceId: deviceId },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m' }
        );

        const newRefreshTokenForStorage = {
            user_id: Number(user.id),
            ip: ip,
            title: titleDevice,
            last_activate_date: new Date(),
            device_id: deviceId
        };

        await this.refreshTokenStorageRepository.save(newRefreshTokenForStorage)

        return refreshToken;
    }
    //
    async refreshToken(user: UsersType, ip: string, titleDevice: string, device_id: string, rToken: string): Promise<string> {

        // Проверяем наличие устройства для пользователя
        const checkDeviceId = await this.refreshTokenStorageRepository.findOne({
            where: {
              user_id: Number(user.id),
              device_id: device_id,
            },
          });

        // Если устройство уже зарегистрировано, обновляем токен
        if (checkDeviceId) {
            const deviceId = checkDeviceId.device_id;
            const refreshToken = this.jwtService.sign(
                { id: user.id, deviceId: deviceId },
                { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m' }
            );
            
            await this.refreshTokenStorageRepository.update(
                { user_id: Number(user.id), device_id: deviceId }, // Критерии поиска
                { last_activate_date: new Date() }                // Поля для обновления
              );
              
            return refreshToken;
        }
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

        const payloadToken = await this.getJwtPayload(rToken)


        const checkToken = await this.refreshTokenStorageRepository.findOne({
            where: {
              device_id: payloadToken.deviceId,
            },
          });
        console.log("checkToken:", checkToken)
        // const [checkToken] = await this.dataSource.query(`
        //     SELECT * FROM refresh_token_storage
        //     WHERE device_id = $1
        // `, [payloadToken.deviceId]);

        //Если приходит undefined - значит токена в базе уже нет, возможно сделали logout, тогда пусть идут входят в систему.
        if (checkToken !== null && rToken !== null) {
            try {
                const result = this.jwtService.verify(rToken, { secret: process.env.JWT_REFRESH_SECRET });
                const newAccessToken = await this.accessToken(result);
                const newRefreshToken = await this.refreshToken(result, ip, titleDevice, checkToken.device_id, rToken);

                return { newAccessToken, newRefreshToken };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    async findTokenInData(rToken: string): Promise<any> {

        try {
            const payloadToken = await this.getJwtPayload(rToken)

            const result = await this.refreshTokenStorageRepository.find({
                where: {
                  device_id: payloadToken.deviceId,
                },
              });
            // const result = await this.dataSource.query(`
            //     SELECT device_id FROM refresh_token_storage
            //     WHERE device_id = $1
            // `, [payloadToken.deviceId]);

            // Проверяем, если результат пустой, возвращаем null
            if (result.length === 0) {
                return null;
            }

            // Если есть данные, возвращаем первую строку
            return result[0];
        } catch (error) {
            return null;
        }
    }

    async deleteTokenFromData(rToken: string): Promise<void> {
        try {
            const payloadToken = await this.getJwtPayload(rToken)

            await this.refreshTokenStorageRepository.delete(
                {device_id: payloadToken.deviceId}
            )
            // await this.dataSource.query(`
            //     DELETE FROM refresh_token_storage
            //     WHERE device_id = $1
            // `, [payloadToken.deviceId]);
        } catch (error) {
            // Можно добавить обработку ошибок, если это нужно
            console.error("Error deleting token:", error);
        }
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
