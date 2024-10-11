import { CommandHandler } from "@nestjs/cqrs"
import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository"


export class TerminateSessionByIdCommand {
    constructor(
        public userId: string, 
        public deviceId: string) {
        
    }
}

@CommandHandler(TerminateSessionByIdCommand)
export class TerminateSessionByIdUseCase {
    constructor (public securityDeviceRepository: SecurityDeviceRepository ) {}

    async execute(command: TerminateSessionByIdCommand): Promise <boolean> {
        const terminateResult = await this.securityDeviceRepository.terminateTargetSessionById(command.userId, command.deviceId)
        return terminateResult
    }
}


