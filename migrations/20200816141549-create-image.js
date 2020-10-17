"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      Image.tableName,
      Image.attributes,
      Image.options
      //'Images', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      // filename: {
      //   type: Sequelize.STRING
      // },
      // mimetype: {
      //   type: Sequelize.STRING
      // },
      // encoding: {
      //   type: Sequelize.STRING
      // },
      // path: {
      //   type: Sequelize.STRING
      // },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
      //}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Images");
  },
};
