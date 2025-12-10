const { Medico, PlanoSaude } = require('../app/models');

class MedicoPlanoController {
  async store(req, res) {
    try {
      const { medico_id, plano_id } = req.body;

      const medico = await Medico.findByPk(medico_id);
      const plano = await PlanoSaude.findByPk(plano_id);

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado' });
      }

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      await medico.addPlanoSaude(plano);

      return res.status(201).json({ message: 'Médico associado ao plano com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao associar médico ao plano', details: error.message });
    }
  }

  async index(req, res) {
    try {
      const { medico_id } = req.params;

      const medico = await Medico.findByPk(medico_id, {
        include: [PlanoSaude]
      });

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado' });
      }

      return res.status(200).json(medico.PlanoSaudes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar planos do médico', details: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { medico_id, plano_id } = req.params;

      const medico = await Medico.findByPk(medico_id);
      const plano = await PlanoSaude.findByPk(plano_id);

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado' });
      }

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      await medico.removePlanoSaude(plano);

      return res.status(200).json({ message: 'Associação removida com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao remover associação', details: error.message });
    }
  }
}

module.exports = new MedicoPlanoController();
