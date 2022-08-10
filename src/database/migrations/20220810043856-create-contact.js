'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      remember_at: {
        type: Sequelize.DATE
      },
      image_id: { type: Sequelize.INTEGER, references: {
        model: 'images',
        key: 'id',
      }},  
      address_id: { type: Sequelize.INTEGER, references: {
        model: 'addresses',
        key: 'id',
      }},
      user_id: { type: Sequelize.INTEGER, references: {
        model: 'addresses',
        key: 'id',
      }},
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_at: {
         allowNull: true,
         type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contacts');
  }
};
