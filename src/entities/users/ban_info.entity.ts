import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ban_info')
export class BanInfoEntity {
  @PrimaryColumn()
  user_id: number; // Первичный ключ, ссылающийся на пользователя

  @Column({ type: 'boolean', default: false }) // Статус бана
  is_banned: boolean;

  @Column({ type: 'varchar', nullable: true }) // Дата бана
  ban_date: string;

  @Column({ type: 'varchar', nullable: true }) // Причина бана
  ban_reason: string;
}
