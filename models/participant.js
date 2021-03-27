"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Participant extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Participant.belongsTo(models.Meeting, {
				foreignKey: "meetingId",
			});
		}
	}
	Participant.init(
		{
			id: {
				primaryKey: true,
				allowNull: false,
				type: DataTypes.UUID,
				validate: {
					notNull: true,
				},
				defaultValue: sequelize.UUIDV4,
			},
			email: {
				type: DataTypes.STRING,
				unique: false,
				allowNull: false,
				validate: {
					notEmpty: true,
					isEmail: true,
				},
			},
			name: DataTypes.STRING,
			answers: DataTypes.TEXT,
			hasCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
		},
		{
			sequelize,
			modelName: "Participant",
		},
	);
	return Participant;
};
