"use strict";
const Meeting = require("../models").Meeting;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Meetings", {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        validate: {
          notNull: true,
        },
        //defaultValue: sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING },
      token: { type: Sequelize.STRING(1024) },
      startTime: { type: Sequelize.DATE },
      endTime: { type: Sequelize.DATE },
      QuizId: {
        type: Sequelize.UUID,
        references: {
          model: "Quizzes",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Meetings");
  },
};
