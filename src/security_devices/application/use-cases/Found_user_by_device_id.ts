import { CommandHandler } from "@nestjs/cqrs"
import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository"


export class FoundUserByDeviceIdCommand {
    constructor( 
        public deviceId: string) {
        
    }
}

@CommandHandler(FoundUserByDeviceIdCommand)
export class FoundUserByDeviceIdUseCase {
    constructor (public securityDeviceRepository: SecurityDeviceRepository ) {}

    async execute(command: FoundUserByDeviceIdCommand): Promise <string> {
        const foundUserByDeviceId = await this.securityDeviceRepository.foundUserIdByDeviceId(command.deviceId)
        return foundUserByDeviceId 
    }
}


