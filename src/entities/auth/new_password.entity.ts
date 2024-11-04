import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('new_password')
export class NewPasswordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  recovery_code: string | null;

  @Column({ type: 'timestamp', name: 'timestamp_new_password', nullable: true })
  timestamp_new_password: Date | null;
}
