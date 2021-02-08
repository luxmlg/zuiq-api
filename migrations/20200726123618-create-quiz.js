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
      schema: { type: Sequelize.TEXT },
      answers: { type: Sequelize.TEXT },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("Quizzes");
  },
};
