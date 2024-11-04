import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from './comment.entity';


@Entity('comments_dislike_storage')
export class CommentDislikeStorageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', nullable: false })
  added_at: Date;

  @Column({ type: 'varchar', nullable: false })
  user_login: string;

  // Связь с пользователем
  @ManyToOne(() => UserEntity, (user) => user.id,{ onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Связь с комментарием
  @ManyToOne(() => CommentEntity, (comment) => comment.id,{ onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: CommentEntity;
}
