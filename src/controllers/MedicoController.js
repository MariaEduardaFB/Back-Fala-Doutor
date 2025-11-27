const { Medico } = require("../app/models")

class MedicoController {
  async store(req, res) {
    try {
      const { nome, crm, telefone } = req.body

      if (!nome || !crm || !telefone) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" })
      }

      const medicoAlreadyExists = await Medico.findOne({ where: { crm } })
      if (medicoAlreadyExists) {
        return res.status(400).json({ error: "Médico já cadastrado" })
      }

      const createdMedico = await Medico.create({ nome, crm, telefone })
      return res.status(201).json(createdMedico)
    } catch (error) {
      return res.status(400).json({ error: "Erro ao cadastrar médico", details: error.message })
    }
  }

  async index(req, res) {
    try {
      const medicos = await Medico.findAll()
      return res.status(200).json(medicos)
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar médicos", details: error.message })
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params
      const medico = await Medico.findByPk(id)
      if (!medico) return res.status(404).json({ error: "Médico não encontrado" })
      return res.status(200).json(medico)
    } catch (error) {
      return res.status(404).json({ error: "Erro ao buscar médico", details: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { nome, crm, telefone } = req.body

      const [affectedRows] = await Medico.update(
        { nome, crm, telefone },
        { where: { id } }
      )

      if (!affectedRows) return res.status(404).json({ error: "Médico não encontrado" })

      const updated = await Medico.findByPk(id)
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(404).json({ error: "Erro ao atualizar médico", details: error.message })
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params
      const deleted = await Medico.destroy({ where: { id } })
      if (!deleted) return res.status(404).json({ error: "Médico não encontrado" })
      return res.status(200).json({ message: "Médico excluído com sucesso" })
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir médico", details: error.message })
    }
  }
}

module.exports = new MedicoController();