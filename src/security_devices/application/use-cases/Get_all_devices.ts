import { CommandHandler } from "@nestjs/cqrs"
import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository"


export class GetAllDevicesCommand {
    constructor(
        public userId: string) {
        
    }
}

@CommandHandler(GetAllDevicesCommand)
export class GetAllDevicesUseCase {
    constructor (public securityDeviceRepository: SecurityDeviceRepository ) {}

    async execute(command: GetAllDevicesCommand): Promise <object> {
        const foundAllDevice = await this.securityDeviceRepository.returnAllDevices(command.userId)
        return foundAllDevice
    }
}


