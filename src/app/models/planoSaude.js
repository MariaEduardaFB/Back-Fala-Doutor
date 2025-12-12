'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlanoSaude extends Model {
    static associate(models) {
      this.hasMany(models.Pacientes, { foreignKey: 'plano_id' });
      this.belongsToMany(models.Medico, { 
        through: 'medico_plano',
        foreignKey: 'plano_id' 
      });
      this.hasMany(models.Consulta, { foreignKey: 'plano_id' });
    }

    
    isAtivo() {
      if (!this.validade) return false;
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const validade = new Date(this.validade);
      validade.setHours(23, 59, 59, 999);
      return validade >= hoje;
    }

    
    getStatus() {
      return this.isAtivo() ? 'ativo' : 'inativo';
    }
  }
  
  PlanoSaude.init({
    nome: DataTypes.STRING,
    operadora: DataTypes.STRING,
    validade: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PlanoSaude',
    tableName: 'plano_saude',
    underscored: true
  });
  
  return PlanoSaude;
};
