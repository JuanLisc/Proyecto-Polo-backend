import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import User from './user.model';

class Meeting extends Model {}

Meeting.init({
	detail: {
		type: DataTypes.STRING,
		allowNull: false
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	hour: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 8,
			max: 22
		}
	},
	duration: {
		type: DataTypes.FLOAT,
		allowNull: false
	}
}, {
	sequelize: sequelize,
	modelName: 'Meeting',
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});

export default Meeting;