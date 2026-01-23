const PlanoSaude = require("../models/PlanoSaude")
const Paciente = require("../models/Paciente")

class PlanoSaudeController {

    async storeForPaciente(req, res) {
        try {
            const { paciente_id } = req.params
            const { nome, operadora, validade } = req.body

            if (!nome || !operadora || !validade) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            
            const paciente = await Paciente.findById(paciente_id)
            if (!paciente) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }

            
            const planoAlreadyExists = await PlanoSaude.findByNome(nome)
            if (planoAlreadyExists) {
                return res.status(400).json({ error: "Plano de saúde já cadastrado" })
            }

           
            const createdPlano = await PlanoSaude.create(nome, operadora, validade)

            
            const pacienteAtualizado = await Paciente.update(
                paciente_id,
                paciente.nome,
                paciente.cpf,
                paciente.telefone,
                createdPlano.id
            )

            return res.status(201).json({
                plano: createdPlano,
                paciente: pacienteAtualizado
            })

        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar plano de saúde", details: error.message })
        }
    }

    async store(req, res) {
        try {
            const { nome, operadora, validade } = req.body

            if (!nome || !operadora || !validade) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            const planoAlreadyExists = await PlanoSaude.findByNome(nome)

            if (planoAlreadyExists) {
                return res.status(400).json({ error: "Plano de saúde já cadastrado" })
            }

            const createdPlano = await PlanoSaude.create(nome, operadora, validade)

            return res.status(201).json(createdPlano)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar plano de saúde", details: error.message })
        }
    }

    async index(req, res) {
        try {
            const planos = await PlanoSaude.findAll()
            return res.status(200).json(planos)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar planos de saúde", details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const plano = await PlanoSaude.findById(id)

            if (!plano) {
                return res.status(404).json({ error: "Plano de saúde não encontrado" })
            }

            return res.status(200).json(plano)
        } catch (error) {
            return res.status(404).json({ error: "Erro ao buscar plano de saúde", details: error.message })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { nome, operadora, validade } = req.body

            const planoAtualizado = await PlanoSaude.update(id, nome, operadora, validade)

            if (!planoAtualizado) {
                return res.status(404).json({ error: "Plano de saúde não encontrado" })
            }

            return res.status(200).json(planoAtualizado)

        } catch (error) {
            return res.status(404).json({ error: "Erro ao atualizar plano de saúde", details: error.message })
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params

            const deleted = await PlanoSaude.delete(id)

            if (!deleted) {
                return res.status(404).json({ error: "Plano de saúde não encontrado" })
            }

            return res.status(200).json({ message: "Plano de saúde excluído com sucesso" })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao excluir plano de saúde", details: error.message })
        }
    }

}

module.exports = new PlanoSaudeController()


