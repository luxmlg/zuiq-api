"use strict";
const Participant = require("../models").Participant;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Participants", {
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
      answers: { type: Sequelize.STRING },
      hasCompleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      MeetingId: {
        type: Sequelize.UUID,
        references: {
          model: "Meetings",
          key: "id",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Participants");
  },
};
