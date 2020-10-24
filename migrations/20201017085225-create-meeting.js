"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      Meeting.tableName,
      Meeting.attributes,
      Meeting.options
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Meetings");
  },
};
