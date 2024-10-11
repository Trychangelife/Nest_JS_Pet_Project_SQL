import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository";
export declare class TerminateSessionByIdCommand {
    userId: string;
    deviceId: string;
    constructor(userId: string, deviceId: string);
}
export declare class TerminateSessionByIdUseCase {
    securityDeviceRepository: SecurityDeviceRepository;
    constructor(securityDeviceRepository: SecurityDeviceRepository);
    execute(command: TerminateSessionByIdCommand): Promise<boolean>;
}
