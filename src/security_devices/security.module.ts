import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { SecurityDeviceController } from "./security.controller";
import { SecurityDeviceService } from "./application/security.service";
import { SecurityDeviceRepository } from "./repostitories/security.repository";
import { GetAllDevicesUseCase } from "./application/use-cases/Get_all_devices";
import { TerminateAllSessionUseCase } from "./application/use-cases/Terminate_all_session";
import { TerminateSessionByIdUseCase } from "./application/use-cases/Terminate_target_session_by_id";
import { FoundUserByDeviceIdUseCase } from "./application/use-cases/Found_user_by_device_id";
import { UsersModule } from "src/users/users.module";


const useCasesDevices = [GetAllDevicesUseCase, TerminateAllSessionUseCase,TerminateSessionByIdUseCase, FoundUserByDeviceIdUseCase]


@Module({
    imports: [UsersModule],
    controllers: [SecurityDeviceController],
    providers: [SecurityDeviceService, SecurityDeviceRepository, ...useCasesDevices],
    exports: [SecurityDeviceService, SecurityDeviceRepository]
  })
  export class SecurityDeviceModule {}