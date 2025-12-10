const { PlanoSaude } = require('../app/models');

class PlanoSaudeController {
  async store(req, res) {
    try {
      const { nome, operadora, validade } = req.body;

      if (!nome || !operadora || !validade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const plano = await PlanoSaude.create({ nome, operadora, validade });
      return res.status(201).json(plano);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar plano de saúde', details: error.message });
    }
  }

  async index(req, res) {
    try {
      const planos = await PlanoSaude.findAll();
      return res.status(200).json(planos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar planos', details: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const plano = await PlanoSaude.findByPk(id);

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      return res.status(200).json(plano);
    } catch (error) {
      return res.status(404).json({ error: 'Erro ao buscar plano', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, operadora, validade } = req.body;

      const plano = await PlanoSaude.findByPk(id);

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      await plano.update({ nome, operadora, validade });

      return res.status(200).json(plano);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar plano', details: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const plano = await PlanoSaude.findByPk(id);

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      await plano.destroy();

      return res.status(200).json({ message: 'Plano excluído com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir plano', details: error.message });
    }
  }
}

module.exports = new PlanoSaudeController();
