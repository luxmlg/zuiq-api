"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Participants", "email", {
			type: Sequelize.STRING,
			unique: false,
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Participants", "email");
	},
};
