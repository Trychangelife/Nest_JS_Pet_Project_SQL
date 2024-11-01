import { Module } from "@nestjs/common";
import { FullDataController } from "./full_delete.controller";




@Module({
    imports: [],
    controllers: [FullDataController],
    providers: [],
  })
  export class FullDeleteModule {}