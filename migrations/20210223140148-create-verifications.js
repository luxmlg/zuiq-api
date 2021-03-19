"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Verifications", {
			id: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					notNull: true,
				},
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			code: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Verifications");
	},
};
