import { Injectable, Next } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { RefreshTokenStorageType } from "../../utils/types"

export const deviceView = {
    _id: 0,
    ip: 1,
    title: 1,
    lastActiveDate: 1,
    deviceId: 1
}

@Injectable()
export class SecurityDeviceRepository {

    constructor ( 
    @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>
    ) {   }
    async returnAllDevices (userId: string): Promise <object> {
        const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }, deviceView).lean()
        return foundAllDevice
    }
    async terminateAllSession(userId: string, deviceId: string): Promise<boolean> {
        const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }).lean();
          for (const device of foundAllDevice) {
          if (device.deviceId !== deviceId) {
            await this.refreshTokenModel.deleteOne({ deviceId: device.deviceId });
          }
        }
        return true;
      }
    async terminateTargetSessionById (userId: string, deviceId: string): Promise <boolean> {
        await this.refreshTokenModel.deleteOne({ userId: userId, deviceId: deviceId });
        return true
    }
    async foundUserIdByDeviceId (deviceId: string): Promise <string> {
        const foundUserByDeviceId = await this.refreshTokenModel.findOne({deviceId: deviceId}).lean()
        if (foundUserByDeviceId) {return foundUserByDeviceId.userId}
        return null
        
    }
}