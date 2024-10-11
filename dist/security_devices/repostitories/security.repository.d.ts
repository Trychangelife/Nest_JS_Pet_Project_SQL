import { Model } from "mongoose";
import { RefreshTokenStorageType } from "../../utils/types";
export declare const deviceView: {
    _id: number;
    ip: number;
    title: number;
    lastActiveDate: number;
    deviceId: number;
};
export declare class SecurityDeviceRepository {
    protected refreshTokenModel: Model<RefreshTokenStorageType>;
    constructor(refreshTokenModel: Model<RefreshTokenStorageType>);
    returnAllDevices(userId: string): Promise<object>;
    terminateAllSession(userId: string, deviceId: string): Promise<boolean>;
    terminateTargetSessionById(userId: string, deviceId: string): Promise<boolean>;
    foundUserIdByDeviceId(deviceId: string): Promise<string>;
}
