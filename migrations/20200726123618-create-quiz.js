"use strict";
const Quiz = require("../models").Quiz;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Quizzes", {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        validate: {
          notNull: true,
        },
        //defaultValue: sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      schema: { type: Sequelize.JSON },
      createdAt: { type: Sequelize.DATE },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Quizzes");
  },
};
