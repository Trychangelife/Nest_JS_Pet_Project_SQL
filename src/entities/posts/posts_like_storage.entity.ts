import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PostEntity } from './posts.entity';


@Entity('posts_like_storage')
export class PostsLikeStorageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' }) // Тип для timestamp with time zone
  added_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true }) // связь с пользователем
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar' })
  user_login: string;

  @ManyToOne(() => PostEntity, (post) => post.id, { eager: true }) // связь с постом
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @Column({ type: 'int' })
  post_id: number; // Ссылка на пост

  
}
