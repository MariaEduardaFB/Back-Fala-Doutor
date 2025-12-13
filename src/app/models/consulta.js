'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consulta extends Model {
    static associate(models) {
      this.belongsTo(models.Pacientes, { foreignKey: 'paciente_id' });
      this.belongsTo(models.Medico, { foreignKey: 'medico_id' });
      this.belongsTo(models.PlanoSaude, { foreignKey: 'plano_id' });
    }
  }
  
  Consulta.init({
    data_hora: DataTypes.DATE,
    descricao: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'agendada'
    }
  }, {
    sequelize,
    modelName: 'Consulta',
    tableName: 'consultas',
    underscored: true
  });
  
  return Consulta;
};
