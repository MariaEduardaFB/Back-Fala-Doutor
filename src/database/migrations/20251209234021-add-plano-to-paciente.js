'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Pacientes', 'plano_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'plano_saude',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pacientes', 'plano_id');
  }
};
