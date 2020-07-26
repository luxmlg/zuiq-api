"use strict";
const User = require("../models").User;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      User.tableName,
      User.attributes,
      User.options
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
