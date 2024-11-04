import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';


@Entity('account_user_data')
export class AccountUserDataEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'varchar', nullable: false })
  password_hash: string;

  @Column({ type: 'varchar', nullable: false })
  password_salt: string;

  // Связь с таблицей пользователей
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
