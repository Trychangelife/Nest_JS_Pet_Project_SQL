import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BlogEntity } from '../blog/blog.entity';
import { UserEntity } from '../users/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', collation: 'C', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  short_description: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', collation: 'C', nullable: true })
  blog_name: string;

  @Column({ type: 'timestamptz', nullable: true })
  created_at: Date;

  @Column({ name: 'blog_id' })
  blog_id: number;

  @Column({ name: 'author_user_id', nullable: true})
  author_user_id: number;
  

  // Связь с блогом
  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' }) // внешний ключ для связи с блогом
  blog: BlogEntity;

  // Связь с автором
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'author_user_id' }) // внешний ключ для связи с автором
  author: UserEntity;
}
