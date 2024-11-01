import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class FullDataController {
  constructor(@InjectDataSource() protected dataSource: DataSource) { }
  @Delete('all-data')
  async deleteAllData() {
    await this.dataSource.createQueryBuilder().delete().from('users').execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('account_user_data')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('ban_info')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('email_confirmation')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('recovery_password_info')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('refresh_token_storage')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('recovery_password')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('new_password')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('email_send_data')
      .execute();
    await this.dataSource.createQueryBuilder().delete().from('blog').execute();
    await this.dataSource.createQueryBuilder().delete().from('posts').execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('posts_like_storage')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('posts_dislike_storage')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('comments')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('comments_like_storage')
      .execute();
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('comments_dislike_storage')
      .execute();
    throw new HttpException('Date is clear', HttpStatus.NO_CONTENT);
  }
}
