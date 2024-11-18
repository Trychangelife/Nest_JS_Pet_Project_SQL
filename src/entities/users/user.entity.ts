import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { BanInfoEntity } from './ban_info.entity';
import { EmailConfirmationEntity } from '../email/email_confirmation.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', collation: 'C.utf8' })
    login: string;

    @Column({ type: 'varchar', collation: 'default' })
    email: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    created_at: Date;

    @OneToOne(() => BanInfoEntity, (banInfo) => banInfo.user_id) // Связь с BanInfoEntity
    banInfo: BanInfoEntity;

    @OneToOne(() => EmailConfirmationEntity)
    @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
    email_confirmation: EmailConfirmationEntity;
}
