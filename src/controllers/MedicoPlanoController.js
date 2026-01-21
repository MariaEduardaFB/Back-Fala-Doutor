const Medico = require("../models/Medico")
const PlanoSaude = require("../models/PlanoSaude")
const MedicoPlano = require("../models/MedicoPlano")

class MedicoPlanoController {

    async store(req, res) {
        try {
            const { medico_id } = req.params
            const { plano_id } = req.body

            if (!plano_id) {
                return res.status(400).json({ error: "plano_id é obrigatório" })
            }

            
            const medico = await Medico.findById(medico_id)
            if (!medico) {
                return res.status(404).json({ error: "Médico não encontrado" })
            }

            
            const plano = await PlanoSaude.findById(plano_id)
            if (!plano) {
                return res.status(404).json({ error: "Plano de saúde não encontrado" })
            }

            
            const associacaoExistente = await MedicoPlano.findByMedicoAndPlano(medico_id, plano_id)
            if (associacaoExistente) {
                return res.status(400).json({ error: "Médico já está associado a este plano" })
            }

            
            const medicoPlano = await MedicoPlano.create(medico_id, plano_id)

            return res.status(201).json({
                message: "Médico associado ao plano com sucesso",
                medico_plano: medicoPlano
            })

        } catch (error) {
            return res.status(400).json({ error: "Erro ao associar médico ao plano", details: error.message })
        }
    }

    async index(req, res) {
        try {
            const { medico_id } = req.params

            
            const medico = await Medico.findById(medico_id)
            if (!medico) {
                return res.status(404).json({ error: "Médico não encontrado" })
            }

            
            const planos = await MedicoPlano.findByMedicoId(medico_id)

            return res.status(200).json({
                medico,
                planos
            })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar planos do médico", details: error.message })
        }
    }

    async destroy(req, res) {
        try {
            const { medico_id, plano_id } = req.params

            
            const medico = await Medico.findById(medico_id)
            if (!medico) {
                return res.status(404).json({ error: "Médico não encontrado" })
            }

            
            const plano = await PlanoSaude.findById(plano_id)
            if (!plano) {
                return res.status(404).json({ error: "Plano de saúde não encontrado" })
            }

            
            const deleted = await MedicoPlano.delete(medico_id, plano_id)

            if (!deleted) {
                return res.status(404).json({ error: "Associação não encontrada" })
            }

            return res.status(200).json({ message: "Médico desassociado do plano com sucesso" })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao desassociar médico do plano", details: error.message })
        }
    }

}

module.exports = new MedicoPlanoController()


