import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Meeting from './meeting.model';

class User extends Model {
	public id: string;
	public email: string;
	public password: string;
}

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
		allowNull: false,
		defaultValue: 'USER'
	},
	isDeleted: {
		type: DataTypes.BOOLEAN,
		field: 'is_deleted',
		defaultValue: false
	},
	deletedAt: {
		type: DataTypes.DATE,
		field: 'deleted_at'
	}
}, {
	sequelize: sequelize,
	modelName: 'User',
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});

User.hasMany(Meeting);
Meeting.belongsTo(User);

export default User;
