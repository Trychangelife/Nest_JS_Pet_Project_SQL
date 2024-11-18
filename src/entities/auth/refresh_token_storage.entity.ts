import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'refresh_token_storage' })
export class RefreshTokenStorageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ip: string;

    @Column()
    title:string;

    @Column()
    device_id:string;

    @CreateDateColumn({ type: 'timestamptz', name: 'last_activate_date' })
    last_activate_date:Date

    @Column()
    user_id: number

    @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) // это указывает, что это внешний ключ, связанный с user_id
    user: UserEntity;
}
