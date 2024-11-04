import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('recovery_password_info')
export class RecoveryPasswordInfoEntity {
  @PrimaryColumn()
  user_id: number; // Первичный ключ, ссылающийся на пользователя

  @Column({ type: 'varchar', nullable: true }) // Строка для кода восстановления
  code_for_recovery: string;

  @Column({ type: 'date', nullable: true }) // Дата создания кода восстановления
  created_date_recovery_code: Date;
}
