const { Pacientes } = require("../app/models")

class PacienteController {

    async store(req, res) {
        try {

            const { nome, cpf, telefone } = req.body

            const pacienteAlreadyExists = await Pacientes.findOne({ where: { cpf } })

            if (pacienteAlreadyExists) {
                return res.status(400).json({ error: "Paciente já cadastrado" })
            }

            if (!nome || !cpf || !telefone) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            const createdPaciente = await Pacientes.create({ nome, cpf, telefone })
            return res.status(201).json(createdPaciente)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar paciente", details: error.message })
        }


    }

    async index(req, res) {
        try {
            const pacientes = await Pacientes.findAll()
            return res.status(200).json(pacientes)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar pacientes", details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const paciente = await Pacientes.findByPk(id)

            if (!paciente) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }
            return res.status(200).json(paciente)
        } catch (error) {
            return res.status(404).json({ error: "Erro ao buscar paciente", details: error.message })
        }

    }

    async update(req, res) {

        try {

            const { id } = req.params
            const { nome, cpf, telefone } = req.body

            await Pacientes.update(
                { nome, cpf, telefone },
                { where: { id: id } }
            )

            return res.status(200).json({ message: "Paciente atualizado com sucesso" })

        } catch (error) {
            return res.status(404).json({ error: "Erro ao atualizarpaciente", details: error.message })
        }


    }

    async destroy(req, res) {

        try {
            const { id } = req.params

            await Pacientes.destroy(
                { where: { id: id } }
            )

            return res.status(200).json({ message: "Paciente excluir com sucesso" })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao excluirpaciente", details: error.message })
        }


    }

}

module.exports = new PacienteController()