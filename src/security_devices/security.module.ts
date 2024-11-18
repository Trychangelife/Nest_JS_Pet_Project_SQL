import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { SecurityDeviceService } from "./application/security.service";
import { SecurityDeviceRepository } from "./repostitories/security.repository";
import { SecurityDeviceController } from "./security.controller";
import { CommandBus, CqrsModule } from "@nestjs/cqrs";
import { GetAllDevicesUseCase } from "./application/use-cases/Get_all_devices";
import { FoundUserByDeviceIdUseCase } from "./application/use-cases/Found_user_by_device_id";
import { TerminateAllSessionUseCase } from "./application/use-cases/Terminate_all_session";
import { TerminateSessionByIdUseCase } from "./application/use-cases/Terminate_target_session_by_id";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenStorageEntity } from "src/entities/auth/refresh_token_storage.entity";



const useCasesDevices = [GetAllDevicesUseCase, TerminateAllSessionUseCase, TerminateSessionByIdUseCase, FoundUserByDeviceIdUseCase]

@Module({
    imports: [UsersModule, CqrsModule, TypeOrmModule.forFeature([
      RefreshTokenStorageEntity,
    ])],
    controllers: [SecurityDeviceController],
    providers: [ SecurityDeviceRepository, ...useCasesDevices,],
    exports: [SecurityDeviceRepository, ...useCasesDevices]
  })
  export class SecurityDeviceModule {}