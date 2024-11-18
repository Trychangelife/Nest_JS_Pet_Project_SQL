import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshTokenStorageEntity } from "src/entities/auth/refresh_token_storage.entity";
import { Repository } from "typeorm";


@Injectable()
export class SecurityDeviceRepository {
    constructor(
        @InjectRepository(RefreshTokenStorageEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenStorageEntity>,
    ) {}

    async returnAllDevices(userId: string): Promise<object[]> {
        const foundAllDevices = await this.refreshTokenRepo
            .createQueryBuilder("device")
            .where("device.user_id = :userId", { userId })
            .select([
                "device.ip",
                "device.title",
                "device.lastActivateDate",
                "device.deviceId"
            ])
            .getMany();

        return foundAllDevices.map(device => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.last_activate_date,
            deviceId: device.device_id,
        }));
    }

    async terminateAllSession(userId: string, deviceId: string): Promise<boolean> {
        const deleteResult = await this.refreshTokenRepo
            .createQueryBuilder()
            .delete()
            .from(RefreshTokenStorageEntity)
            .where("user_id = :userId", { userId })
            .andWhere("device_id <> :deviceId", { deviceId })
            .execute();

        return deleteResult.affected > 0;
    }

    async terminateTargetSessionById(userId: string, deviceId: string): Promise<boolean> {
        const deleteResult = await this.refreshTokenRepo
            .createQueryBuilder()
            .delete()
            .from(RefreshTokenStorageEntity)
            .where("user_id = :userId", { userId })
            .andWhere("device_id = :deviceId", { deviceId })
            .execute();

        return deleteResult.affected > 0;
    }

    async foundUserIdByDeviceId(deviceId: string): Promise<number | null> {
        const result = await this.refreshTokenRepo
            .createQueryBuilder("device")
            .select("device.user_id")
            .where("device.device_id = :deviceId", { deviceId })
            .getOne();

        return result ? result.user_id : null;
    }
}
