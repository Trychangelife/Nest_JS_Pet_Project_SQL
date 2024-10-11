import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "../guards/jwt.service";
import { SecurityDeviceController } from "./security.controller";
import { SecurityDeviceService } from "./application/security.service";
import { MongooseModule } from "@nestjs/mongoose";
import { refreshTokenSchema } from "../db";
import { SecurityDeviceRepository } from "./repostitories/security.repository";



@Module({
    imports: [
    MongooseModule.forFeature([
    {name: 'RefreshToken', schema: refreshTokenSchema},
])
],
    controllers: [SecurityDeviceController],
    providers: [JwtService, JwtServiceClass, SecurityDeviceService, SecurityDeviceRepository],
    exports: []
  })
  export class SecurityDeviceModule {}