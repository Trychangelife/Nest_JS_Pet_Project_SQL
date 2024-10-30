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
        protected jwtService: JwtService
    ) {}

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
    //
    async refreshToken(user: UsersType, ip: string, titleDevice: string, device_id: string ,rToken: string): Promise<string> {

        // Проверяем наличие устройства для пользователя
        const [checkDeviceId] = await this.dataSource.query(`
            SELECT * FROM refresh_token_storage
            WHERE user_id = $1 AND device_id = $2
        `, [user.id, device_id]);

        // Если устройство уже зарегистрировано, обновляем токен
        if (checkDeviceId) {
            const deviceId = checkDeviceId.device_id;
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
        //Если приходит undefined - значит токена в базе уже нет, возможно сделали logout, тогда пусть идут входят в систему.
        if (checkToken !== undefined) {
            try {
                const result = this.jwtService.verify(checkToken.refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
                const newAccessToken = await this.accessToken(result);
                const newRefreshToken = await this.refreshToken(result, ip, titleDevice, checkToken.device_id ,rToken);

                return { newAccessToken, newRefreshToken };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    async findTokenInData(rToken: string): Promise<any> {
        try {
            const result = await this.dataSource.query(`
                SELECT refresh_token FROM refresh_token_storage
                WHERE refresh_token = $1
            `, [rToken]);
    
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
            await this.dataSource.query(`
                DELETE FROM refresh_token_storage
                WHERE refresh_token = $1
            `, [rToken]);
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
