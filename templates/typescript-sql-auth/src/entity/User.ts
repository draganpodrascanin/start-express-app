import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Index,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

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
	passwordResetToken!: string | null;

	@Column({ nullable: true, type: 'datetime' })
	passwordResetExpires!: Date | null;

	@Column({ nullable: true, type: 'datetime' })
	passwordChangedAt!: Date | null;

	static passwordMatchWithPasswordConfirm(
		password: string,
		passwordConfirm: string
	) {
		return password === passwordConfirm;
	}

	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 12);
	}

	isCorrectPassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}

	createPasswordResetToken() {
		const resetToken = crypto.randomBytes(32).toString('hex');

		this.passwordResetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

		return resetToken;
	}

	checkIfPasswordResetTokenExpired() {
		if (!this.passwordResetExpires) return true;
		return this.passwordResetExpires < new Date();
	}

	setPasswordChangedAt() {
		this.passwordChangedAt = new Date(Date.now() - 1000);
	}

	changedPasswordAfter(date: Date) {
		if (!this.passwordChangedAt) return false;
		return date < this.passwordChangedAt;
	}
}
