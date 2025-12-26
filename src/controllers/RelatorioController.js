const { Consulta } = require('../app/models');
const { Op, Sequelize } = require('sequelize');

module.exports.agendamentosPorDia = async (req, res) => {
  try {
    const result = await Consulta.findAll({
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM-DD'), 'dia'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
      ],
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM-DD')],
      order: [[Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM-DD'), 'ASC']],
      raw: true
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
  }
};

module.exports.agendamentosDeUmDia = async (req, res) => {
  try {
    const { dia } = req.query;
    if (!dia) return res.status(400).json({ error: 'Informe o dia!' });

    const result = await Consulta.findAll({
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM-DD'), 'dia'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
      ],
      where: {
        data_hora: {
          [Op.gte]: `${dia} 00:00:00`,
          [Op.lte]: `${dia} 23:59:59`
        }
      },
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM-DD')],
      raw: true
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
  }
};

module.exports.agendamentosPorMes = async (req, res) => {
  try {
    const result = await Consulta.findAll({
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM'), 'mes'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
      ],
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM')],
      order: [[Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY-MM'), 'ASC']],
      raw: true
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
  }
};

module.exports.agendamentosPorAno = async (req, res) => {
  try {
    const result = await Consulta.findAll({
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY'), 'ano'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
      ],
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY')],
      order: [[Sequelize.fn('TO_CHAR', Sequelize.col('data_hora'), 'YYYY'), 'ASC']],
      raw: true
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: error.message });
  }
};