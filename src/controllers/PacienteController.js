const Paciente = require("../models/Paciente")
const PlanoSaude = require("../models/PlanoSaude")

class PacienteController {

    async store(req, res) {
        try {
            const { nome, cpf, telefone, plano_id } = req.body

            if (!nome || !cpf || !telefone) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            const pacienteAlreadyExists = await Paciente.findByCpf(cpf)

            if (pacienteAlreadyExists) {
                return res.status(400).json({ error: "Paciente já cadastrado" })
            }

            const createdPaciente = await Paciente.create(nome, cpf, telefone, plano_id)

            return res.status(201).json(createdPaciente)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar paciente", details: error.message })
        }
    }

    async index(req, res) {
        try {
            const pacientes = await Paciente.findAll()
            return res.status(200).json(pacientes)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar pacientes", details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const paciente = await Paciente.findById(id)

            if (!paciente) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }

            if(!paciente.plano_id){
                return res.status(200).json(paciente)
            }

            if (paciente.plano_id) {
                const planoSaude = await PlanoSaude.findById(paciente.plano_id)
                const pacienteComPlano = {...paciente, planoSaude: {...planoSaude}}
                return res.status(200).json(pacienteComPlano)
            }

            

            return res.status(200).json(paciente)
        } catch (error) {
            return res.status(404).json({ error: "Erro ao buscar paciente", details: error.message })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { nome, cpf, telefone, plano_id } = req.body

            const pacienteAtualizado = await Paciente.update(id, nome, cpf, telefone, plano_id)

            if (!pacienteAtualizado) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }

            return res.status(200).json(pacienteAtualizado)

        } catch (error) {
            return res.status(404).json({ error: "Erro ao atualizar paciente", details: error.message })
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params

            const deleted = await Paciente.delete(id)

            if (!deleted) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }

            return res.status(200).json({ message: "Paciente excluído com sucesso" })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao excluir paciente", details: error.message })
        }
    }

}

module.exports = new PacienteController()