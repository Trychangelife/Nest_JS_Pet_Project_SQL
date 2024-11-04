import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recovery_password')
export class RecoveryPasswordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true }) // Указываем nullable, если поле может быть пустым
  ip: string;

  @Column({ type: 'timestamp', nullable: true }) // Тип для timestamp without time zone
  email_send_date: Date;

  @Column({ type: 'varchar', nullable: true }) // Указываем nullable, если поле может быть пустым
  email: string;
}
