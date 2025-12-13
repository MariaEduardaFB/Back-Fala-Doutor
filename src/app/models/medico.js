'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medico extends Model {
    static associate(models) {
      this.belongsToMany(models.PlanoSaude, { 
        through: {
          model: 'medico_plano'
        },
        foreignKey: 'medico_id',
        otherKey: 'plano_id',
        timestamps: false
      });
      this.hasMany(models.Consulta, { foreignKey: 'medico_id' });
    }
  }
  Medico.init({
    nome: DataTypes.STRING,
    crm: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Medico',
  });
  return Medico;
};