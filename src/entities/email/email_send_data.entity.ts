import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('email_send_data')
export class EmailSendDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  ip: string | null;

  @Column({ type: 'timestamp', name: 'email_send_date', nullable: true })
  email_send_date: Date | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;
}
