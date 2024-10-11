import { Controller, Delete, Get, HttpException, HttpStatus, Param, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtServiceClass } from "../guards/jwt.service";
import { PayloadType, RefreshTokenStorageType } from "../utils/types";
import { UsersRepository } from "../users/repositories/users.repository";
import { SecurityDeviceService } from "./application/security.service";
import { CommandBus } from "@nestjs/cqrs";
import { GetAllDevicesCommand } from "./application/use-cases/Get_all_devices";
import { TerminateAllSessionCommand } from "./application/use-cases/Terminate_all_session";
import { TerminateSessionByIdCommand } from "./application/use-cases/Terminate_target_session_by_id";
import { FoundUserByDeviceIdCommand } from "./application/use-cases/Found_user_by_device_id";

@Controller('security')
export class SecurityDeviceController {

    constructor(
        protected jwtServiceClass: JwtServiceClass,
        protected usersRepository: UsersRepository, 
        protected securityService: SecurityDeviceService,
        private commandBus: CommandBus,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>) {
    }
    //GET - список всех активных сессий пользователя
    @Get('devices')
    async returnAllDevices(@Req() req ) {
        const refreshToken = req.cookies["refreshToken"];
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken)
        if (!refreshToken) {
            throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)
        }
        const resultAllDevice = await this.commandBus.execute(new GetAllDevicesCommand(userId))
        return resultAllDevice
    }
    //DELETE - удаление всех других (кроме текущей) сессий
    @Delete('devices')
    async terminateAllSession(@Req() req ) {
        const refreshToken = req.cookies["refreshToken"];
        const userAgent = req.headers['user-agent'] 
        if (!refreshToken) 
        {throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)}
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken)
        const checkRefreshToken = await this.jwtServiceClass.checkRefreshToken(refreshToken)
        if (!checkRefreshToken) {throw new HttpException('Refresh token expired or incorect', HttpStatus.UNAUTHORIZED)}
        const payload: PayloadType = await this.jwtServiceClass.getJwtPayload(refreshToken)
        await this.commandBus.execute(new TerminateAllSessionCommand(userId, payload.deviceId))
        throw new HttpException("All session terminate", HttpStatus.NO_CONTENT);
        
    }
    @Delete('devices/:deviceId')
    async terminateTargetSessionById(@Req() req, @Param('deviceId') deviceId: string) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)
        } 
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken)
        const foundUserIdByDeviceId = await this.commandBus.execute(new FoundUserByDeviceIdCommand(deviceId))
        if (foundUserIdByDeviceId == null) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        //const checkRefreshToken = await this.jwtServiceClass.checkRefreshToken(refreshToken)
        if (!userId) {
            throw new HttpException('Refresh token expired or incorrect', HttpStatus.UNAUTHORIZED)
        }
        const payload: PayloadType = await this.jwtServiceClass.getJwtPayload(refreshToken)
        if (payload.id !== foundUserIdByDeviceId) {
            throw new HttpException('Forbidden, this user does not have authorization to delete this device ID', HttpStatus.FORBIDDEN)
        }
        await this.commandBus.execute(new TerminateSessionByIdCommand(userId, deviceId))
        throw new HttpException("All sessions terminated", HttpStatus.NO_CONTENT);
    }
}
 