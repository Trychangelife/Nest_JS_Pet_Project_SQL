import { SecurityDeviceRepository } from "src/security_devices/repostitories/security.repository";
export declare class GetAllDevicesCommand {
    userId: string;
    constructor(userId: string);
}
export declare class GetAllDevicesUseCase {
    securityDeviceRepository: SecurityDeviceRepository;
    constructor(securityDeviceRepository: SecurityDeviceRepository);
    execute(command: GetAllDevicesCommand): Promise<object>;
}
