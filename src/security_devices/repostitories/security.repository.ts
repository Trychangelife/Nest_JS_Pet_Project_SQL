import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

export const deviceView = {
    _id: 0,
    ip: 1,
    title: 1,
    lastActiveDate: 1,
    deviceId: 1
}

@Injectable()
export class SecurityDeviceRepository {

    constructor ( 
    @InjectDataSource() protected dataSource: DataSource
    ) {   }


    async returnAllDevices(userId: string): Promise<object[]> {
      const foundAllDevice = await this.dataSource.query(`
          SELECT *
          FROM refresh_token_storage
          WHERE user_id = $1
      `, [userId]);
  
      // Преобразуем каждый элемент массива в нужный формат
      const resultView = foundAllDevice.map((device: any) => ({
          ip: device.ip,
          title: device.title,
          lastActiveDate: device.last_activate_date,
          deviceId: device.device_id,
      }));
      return resultView;
  }
  async terminateAllSession(userId: string, deviceId: string): Promise<boolean> {
    // Находим все устройства пользователя, кроме указанного deviceId
    const foundAllDevices = await this.dataSource.query(`
        SELECT device_id
        FROM refresh_token_storage
        WHERE user_id = $1 AND device_id <> $2
    `, [userId, deviceId]);

    // Удаляем все найденные устройства, кроме указанного
    if (foundAllDevices.length > 0) {
        await this.dataSource.query(`
            DELETE FROM refresh_token_storage
            WHERE user_id = $1 AND device_id <> $2
        `, [userId, deviceId]);
    }

    return true;
}
async terminateTargetSessionById(userId: string, deviceId: string): Promise<boolean> {
  await this.dataSource.query(`
      DELETE FROM refresh_token_storage
      WHERE user_id = $1 AND device_id = $2
  `, [userId, deviceId]);

  return true;
}

async foundUserIdByDeviceId(deviceId: string): Promise<string | null> {
  const result = await this.dataSource.query(`
      SELECT user_id
      FROM refresh_token_storage
      WHERE device_id = $1
      LIMIT 1
  `, [deviceId]);

  // Проверяем, найден ли пользователь по deviceId
  if (result.length > 0) {
      return result[0].user_id; // Возвращаем userId, если запись найдена
  }
  return null; // Возвращаем null, если запись не найдена
}

}