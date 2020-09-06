import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import uniqid from 'uniqid';
import randomBytes from '../utils/radnomBytes';

const setId = () => {
	const pre = randomBytes(12);
	return uniqid(pre);
};

//set methods for model
class User extends Model {
	//password and password confirm match when signup, or changing password
	static passwordMatchWithPasswordConfirm(password, passwordConfirm) {
		return password === passwordConfirm;
	}

	//is password correct when logging in
	static async providedPasswordMatchUserPassword(
		passwordProvided,
		userPassword
	) {
		return await bcrypt.compare(passwordProvided, userPassword);
	}

	createPasswordResetToken() {
		const resetToken = crypto.randomBytes(32).toString('hex');

		this.passwordResetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

		return resetToken;
	}

	changedPasswordAfter(date) {
		const iat = new Date(date);
		if (!this.passwordChangedAt) return false;
		return this.passwordChangedAt > iat;
	}
}

//what user table looks like
User.init(
	{
		// Model attributes are defined here
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true,
			defaultValue: setId,
		},
		email: {
			type: DataTypes.STRING(100),
			unique: true,
			allowNull: false,
			isLowercase: true,
			validate: {
				isEmail: true,
			},
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				moreThanSixCharacters(value) {
					if (value.length < 6)
						throw new Error('password need to have more than six characters');
				},
			},
			// get() {
			// 	return null;
			// },
		},
		passwordChangedAt: {
			type: DataTypes.DATE,
		},
		passwordResetToken: {
			type: DataTypes.STRING,
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: 1,
			allowNull: false,
		},
	},
	{
		defaultScope: {
			where: {
				active: true,
			},
			attributes: { exclude: ['password'] },
		},
		scopes: {
			withPassword: {
				where: {
					active: 1,
				},
			},
			inactiveUsers: {
				where: {
					active: 0,
				},
			},
		},
		// Other model options go here
		sequelize, // We need to pass the connection instance
		modelName: 'User', //
	}
);

User.addHook('beforeSave', 'hashPassword', async (user, options) => {
	if (!user.changed('password')) return;

	const hashedPassword = await bcrypt.hash(user.password, 12);
	user.password = hashedPassword;
});

User.addHook('beforeSave', 'setPasswordChangedAt', (user, options) => {
	if (!user.changed('password')) return;

	user.passwordChangedAt = new Date(Date.now() - 1000);
});

export default User;
