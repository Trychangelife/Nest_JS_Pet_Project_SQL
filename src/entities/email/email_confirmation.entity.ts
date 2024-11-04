import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('email_confirmation')
export class EmailConfirmationEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'uuid', name: 'code_for_activated', nullable: true })
  code_for_activated: string | null;

  @Column({ type: 'boolean', name: 'activated_status', default: false })
  activated_status: boolean;

  // Связь с таблицей пользователей
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
