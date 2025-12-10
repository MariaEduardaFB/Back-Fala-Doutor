const { Consulta, Pacientes, Medico, PlanoSaude } = require('../app/models');

class ConsultaController {
  async store(req, res) {
    try {
      const { paciente_id, medico_id, data_hora } = req.body;

      const paciente = await Pacientes.findByPk(paciente_id, {
        include: [PlanoSaude]
      });

      if (!paciente || !paciente.plano_id) {
        return res.status(400).json({ error: 'Paciente sem plano de saúde' });
      }

      const medico = await Medico.findByPk(medico_id, {
        include: [{
          model: PlanoSaude,
          where: { id: paciente.plano_id }
        }]
      });

      if (!medico) {
        return res.status(400).json({ error: 'Médico não atende este plano de saúde' });
      }

      const consulta = await Consulta.create({
        paciente_id,
        medico_id,
        plano_id: paciente.plano_id,
        data_hora
      });

      return res.status(201).json(consulta);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar consulta', details: error.message });
    }
  }

  async index(req, res) {
    try {
      const consultas = await Consulta.findAll({
        include: [
          { model: Pacientes },
          { model: Medico },
          { model: PlanoSaude }
        ]
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
      const { data_hora, status } = req.body;

      const consulta = await Consulta.findByPk(id);

      if (!consulta) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }

      await consulta.update({ data_hora, status });

      return res.status(200).json(consulta);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar consulta', details: error.message });
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
