const { Consulta, Pacientes, Medico, PlanoSaude } = require('../app/models');
const { Op } = require('sequelize');

class ConsultaController {
  async store(req, res) {
    try {
      const { paciente_id, medico_id, data_hora, descricao } = req.body;

      const paciente = await Pacientes.findByPk(paciente_id, {
        include: [{ model: PlanoSaude, as: 'PlanoSaude' }]
      });

      if (!paciente || !paciente.plano_id) {
        return res.status(400).json({ error: 'Paciente sem plano ativo. É necessário ter um plano de saúde ativo para criar a consulta' });
      }

      const planoSaude = paciente.PlanoSaude;
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const validade = new Date(planoSaude.validade);
      validade.setHours(23, 59, 59, 999);
      
      if (validade < hoje) {
        return res.status(400).json({ error: 'Plano de Saúde vencido. Não é possivel criar uma consulta com o plano fora da validade' });
      }

      
      const medico = await Medico.findByPk(medico_id);
      
      if (!medico) {
        return res.status(400).json({ error: 'Médico não encontrado' });
      }

      const consulta = await Consulta.create({
        paciente_id,
        medico_id,
        plano_id: paciente.plano_id,
        data_hora,
        descricao,
        status: 'agendada'
      });

      const consultaCompleta = await Consulta.findByPk(consulta.id, {
        include: [
          { model: Pacientes },
          { model: Medico },
          { model: PlanoSaude }
        ]
      });

      return res.status(201).json(consultaCompleta);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return res.status(400).json({ error: 'Erro ao criar agendamento:', details: error.message });
    }
  }

  async index(req, res) {
    try {
      const { dataInicial, dataFinal } = req.query;
      const where = {};

      if (dataInicial && dataFinal) {
        where.data_hora = {
          [Op.between]: [
            `${dataInicial} 00:00:00`,
            `${dataFinal} 23:59:59`
          ]
        };
      }

      const consultas = await Consulta.findAll({
        where,
        include: [
          { model: Pacientes },
          { model: Medico },
          { model: PlanoSaude }
        ],
        order: [['data_hora', 'DESC']]
      });
      return res.status(200).json(consultas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar consultas', details: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const consulta = await Consulta.findByPk(id, {
        include: [
          { model: Pacientes },
          { model: Medico },
          { model: PlanoSaude }
        ]
      });

      if (!consulta) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }

      return res.status(200).json(consulta);
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao buscar consulta', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data_hora, status, descricao } = req.body;

      const consulta = await Consulta.findByPk(id);

      if (!consulta) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }

      await consulta.update({ data_hora, status, descricao });

      const consultaAtualizada = await Consulta.findByPk(id, {
        include: [
          { model: Pacientes },
          { model: Medico },
          { model: PlanoSaude }
        ]
      });

      return res.status(200).json(consultaAtualizada);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar a consulta', details: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const consulta = await Consulta.findByPk(id);

      if (!consulta) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }

      await consulta.destroy();

      return res.status(200).json({ message: 'Consulta excluída com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir consulta', details: error.message });
    }
  }
}

module.exports = new ConsultaController();
