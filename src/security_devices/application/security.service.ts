import { Injectable } from "@nestjs/common"
import { RefreshTokenStorageType } from "../../utils/types"



//@Injectable()
export class SecurityDeviceService {

    constructor (
        //public securityDeviceRepository: SecurityDeviceRepository
        ) {

    }
//     async returnAllDevices (userId: string): Promise <object> {
//     const foundAllDevice = await this.securityDeviceRepository.returnAllDevices(userId)
//     return foundAllDevice
// }
//     async terminateAllSession (userId: string, deviceId: string): Promise <boolean> {
//     const terminateResult = await this.securityDeviceRepository.terminateAllSession(userId, deviceId)
//     return terminateResult
// }
//     async terminateTargetSessionById (userId: string, deviceId: string): Promise <boolean> {
//     const terminateResult = await this.securityDeviceRepository.terminateTargetSessionById(userId, deviceId)
//     return terminateResult
// }
//     async foundUserIdByDeviceId (deviceId: string): Promise <string> {
//     const foundUserByDeviceId = await this.securityDeviceRepository.foundUserIdByDeviceId(deviceId)
//     return foundUserByDeviceId 
// }
}