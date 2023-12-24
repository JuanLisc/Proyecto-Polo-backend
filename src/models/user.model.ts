import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class User extends Model {}

User.init({
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
		field: 'first_name'
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
		field: 'last_name'
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	role: {
		type: DataTypes.ENUM('ADMIN', 'USER'),
		allowNull: false
	},
	deletedAt: {
		type: DataTypes.DATE,
		defaultValue: new Date(),
		field: 'deleted_at'
	}
}, {
	sequelize: sequelize,
	modelName: 'User',
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});

export default User;
