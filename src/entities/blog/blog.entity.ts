import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('blog')
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', collation: 'C', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  website_url: string;

  @Column({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_membership: boolean;

  @Column({ type: 'varchar', nullable: true })
  owner_user_login: string;
  
  @Column({ name: 'owner_user_id', nullable: true})
  owner_user_id: number;
  
  // Связь с владельцем (пользователем)
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'owner_user_id' })
  owner_user: UserEntity;
}
