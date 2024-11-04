import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from '../posts/posts.entity';
import { UserEntity } from '../users/user.entity';


@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  author_login_id: string;

  @Column({ type: 'timestamptz', nullable: true })
  created_at: Date;

  // Связь с автором комментария
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'author_user_id' })
  authorUser: UserEntity;

  // Связь с постом
  @ManyToOne(() => PostEntity, (post) => post.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
