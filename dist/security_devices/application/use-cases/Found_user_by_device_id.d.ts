import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository";
export declare class FoundUserByDeviceIdCommand {
    deviceId: string;
    constructor(deviceId: string);
}
export declare class FoundUserByDeviceIdUseCase {
    securityDeviceRepository: SecurityDeviceRepository;
    constructor(securityDeviceRepository: SecurityDeviceRepository);
    execute(command: FoundUserByDeviceIdCommand): Promise<string>;
}
