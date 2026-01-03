const { Consulta } = require('../app/models');
const { Op, Sequelize } = require('sequelize');

module.exports.buscaAgendamentos = async (req, res) => {
    const { dataInicial, dataFinal } = req.query;

    if (!dataInicial || !dataFinal) {
        return res.status(400).json({ error: 'Parâmetros dataInicial e dataFinal são obrigatórios.' });
    }
    
    const dataInicialStr = dataInicial.split(' ')[0];
    const dataFinalStr = dataFinal.split(' ')[0];

    const dataInicioObj = new Date(`${dataInicialStr}T00:00:00.000Z`);
    const dataFimObj = new Date(`${dataFinalStr}T23:59:59.999Z`);

    try {
        const todas = await Consulta.findAll({
            attributes: ['id', 'data_hora'],
            raw: true,
            order: [['data_hora', 'ASC']]
        });
        console.log(`Total de consultas no banco: ${todas.length}`);
        todas.forEach(c => console.log(`  ID: ${c.id}, Data: ${c.data_hora}`));
        
        const result = await Consulta.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('data_hora')), 'dia'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade']
            ],
            where: {
                data_hora: {
                    [Op.between]: [dataInicioObj, dataFimObj]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('data_hora'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('data_hora')), 'ASC']],
            raw: true
        });

        console.log(`Consultas filtradas: ${result.length}`);
        console.log("Resultado:", JSON.stringify(result, null, 2));

        return res.json(result);
    }
    catch (error) {
        console.error("Erro na busca:", error);
        return res.status(500).json({ error: 'Erro ao buscar agendamentos', details: error.message });
    }
}






















