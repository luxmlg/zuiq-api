"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Verifications", "isVerified", {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Verifications", "isVerified");
	},
};
