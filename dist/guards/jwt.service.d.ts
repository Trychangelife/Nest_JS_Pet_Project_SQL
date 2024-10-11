import { Model } from "mongoose";
import { JwtService } from '@nestjs/jwt';
import { PayloadType, RefreshTokenStorageType } from "src/utils/types";
import { UsersType } from "src/users/dto/UsersType";
export declare class JwtServiceClass {
    protected refreshTokenModel: Model<RefreshTokenStorageType>;
    protected jwtService: JwtService;
    constructor(refreshTokenModel: Model<RefreshTokenStorageType>, jwtService: JwtService);
    accessToken(user: UsersType): Promise<string>;
    refreshToken(user: UsersType, ip: string, titleDevice: string, rToken?: string): Promise<string>;
    getUserByAccessToken(token: string): Promise<any>;
    getUserByRefreshToken(token: string): Promise<any>;
    getNewAccessToken(rToken: string, ip: string, titleDevice: string): Promise<object | null>;
    checkRefreshToken(refreshToken: string): Promise<boolean | object>;
    getJwtPayload(refreshToken: string): Promise<PayloadType>;
}
