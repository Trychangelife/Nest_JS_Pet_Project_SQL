import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository";
export declare class TerminateAllSessionCommand {
    userId: string;
    deviceId: string;
    constructor(userId: string, deviceId: string);
}
export declare class TerminateAllSessionUseCase {
    securityDeviceRepository: SecurityDeviceRepository;
    constructor(securityDeviceRepository: SecurityDeviceRepository);
    execute(command: TerminateAllSessionCommand): Promise<boolean>;
}
