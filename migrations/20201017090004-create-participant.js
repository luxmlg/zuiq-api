"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      Participant.tableName,
      Participant.attributes,
      Participant.options
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Participants");
  },
};
