import { CommandHandler } from "@nestjs/cqrs"
import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository"


export class TerminateAllSessionCommand {
    constructor(
        public userId: string, 
        public deviceId: string) {
        
    }
}

@CommandHandler(TerminateAllSessionCommand)
export class TerminateAllSessionUseCase {
    constructor (public securityDeviceRepository: SecurityDeviceRepository ) {}

    async execute(command: TerminateAllSessionCommand): Promise <boolean> {
        const terminateResult = await this.securityDeviceRepository.terminateAllSession(command.userId, command.deviceId)
        return terminateResult
    }
}


