"use strict";
const { Model } = require("sequelize");
//import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
//import { Sequelize } from ".";

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Quiz, { foreignKey: "userId", onDelete: "CASCADE" });
			User.hasMany(models.Meeting, { foreignKey: "userId", onDelete: "CASCADE" });
		}
	}

	User.findByLogin = async (login) => {
		let user = await User.findOne({
			where: { username: login },
		});

		if (!user) {
			user = await User.findOne({
				where: { email: login },
			});
		}

		return user;
	};

	User.init(
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
			username: {
				type: DataTypes.STRING,
				unqiue: true,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					notEmpty: true,
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [7, 42],
				},
			},
			role: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "User",
		},
	);
	User.beforeCreate(async (user) => {
		user.password = await user.generatePasswordHash();
	});

	User.prototype.generatePasswordHash = async function () {
		const saltRounds = 10;
		return await bcrypt.hash(this.password, saltRounds);
	};

	User.prototype.validatePassword = async function (password) {
		return await bcrypt.compare(password, this.password);
	};

	return User;
};
