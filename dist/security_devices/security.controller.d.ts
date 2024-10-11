import { Model } from "mongoose";
import { JwtServiceClass } from "../guards/jwt.service";
import { RefreshTokenStorageType } from "../utils/types";
import { UsersRepository } from "../users/repositories/users.repository";
import { SecurityDeviceService } from "./application/security.service";
import { CommandBus } from "@nestjs/cqrs";
export declare class SecurityDeviceController {
    protected jwtServiceClass: JwtServiceClass;
    protected usersRepository: UsersRepository;
    protected securityService: SecurityDeviceService;
    private commandBus;
    protected refreshTokenModel: Model<RefreshTokenStorageType>;
    constructor(jwtServiceClass: JwtServiceClass, usersRepository: UsersRepository, securityService: SecurityDeviceService, commandBus: CommandBus, refreshTokenModel: Model<RefreshTokenStorageType>);
    returnAllDevices(req: any): Promise<any>;
    terminateAllSession(req: any): Promise<void>;
    terminateTargetSessionById(req: any, deviceId: string): Promise<void>;
}
