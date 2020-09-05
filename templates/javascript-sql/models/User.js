import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

//THIS IS JUST AN EXAMPLE MODEL
//YOU CAN START WITH READY AUTHENTICATION IF YOU ADD --auth AT THE END OF START-EXPRESS-APP
class User extends Model {}

User.init(
	{
		// Model attributes are defined here
		email: {
			type: DataTypes.STRING(100),
			unique: true,
			allowNull: false,
			isEmail: true,
			isLowercase: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			isEmail: true,
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
	},
	{
		// Other model options go here
		sequelize, // We need to pass the connection instance
		modelName: 'User', //
	}
);

export default User;
