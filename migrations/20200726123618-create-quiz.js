"use strict";
const User = require("../models").Quiz;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      Quiz.tableName,
      Quiz.attributes,
      Quiz.options
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Quizzes");
  },
};
