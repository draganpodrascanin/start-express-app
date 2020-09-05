import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: number;

	@Column({ nullable: false, type: 'varchar', length: 30 })
	firstName!: string;

	@Column({ nullable: false, type: 'varchar', length: 30 })
	lastName!: string;

	@Column({ nullable: false, type: 'varchar', length: 100 })
	@Index({ unique: true })
	email!: string;

	@Column({ nullable: false, type: 'varchar', length: 255 })
	password!: string;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	passwordResetToken!: string;

	@Column({ nullable: true, type: 'datetime' })
	passwordResetExpires!: Date;
}
