'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pacientes extends Model {
    static associate(models) {
      this.belongsTo(models.PlanoSaude, { 
        foreignKey: 'plano_id',
        as: 'PlanoSaude'
      });
      this.hasMany(models.Consulta, { foreignKey: 'paciente_id' });
    }
  }
  Pacientes.init({
    nome: DataTypes.STRING,
    cpf: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pacientes',
  });
  return Pacientes;
};