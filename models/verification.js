"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Verification extends Model {
		static associate(models) {}
	}
	Verification.init(
		{
			id: {
				primaryKey: true,
				allowNull: false,
				type: DataTypes.UUID,
				validate: {
					notNull: true,
				},
			},
			email: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			code: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "Verification",
		},
	);

	return Verification;
};
