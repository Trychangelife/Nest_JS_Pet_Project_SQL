import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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
}
