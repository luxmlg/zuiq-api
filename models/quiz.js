"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Quiz extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Quiz.belongsTo(models.User, {
				foreignKey: "userId",
			});
			Quiz.hasMany(models.Meeting, { foreignKey: "quizId", onDelete: "CASCADE" });
			// define association here
		}
	}
	Quiz.init(
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
			name: DataTypes.STRING,
			schema: DataTypes.TEXT,
			answers: DataTypes.TEXT,
			createdAt: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Quiz",
		},
	);

	return Quiz;
};
