"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Meeting extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Meeting.belongsTo(models.Quiz, {
				foreignKey: {
					name: "quizId",
					field: "quizId",
				},
			});
			Meeting.belongsTo(models.User, {
				foreignKey: {
					name: "userId",
					field: "userId",
				},
			});
			Meeting.hasMany(models.Participant, { onDelete: "CASCADE" });
		}
	}
	Meeting.init(
		{
			id: {
				primaryKey: true,
				allowNull: false,
				type: DataTypes.UUID,
				// validate: {
				//   notNull: true,
				// },
				//defaultValue: sequelize.UUIDV4,
			},
			name: DataTypes.STRING,
			token: DataTypes.STRING(1024),
			startTime: DataTypes.DATE,
			endTime: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Meeting",
		},
	);
	return Meeting;
};
