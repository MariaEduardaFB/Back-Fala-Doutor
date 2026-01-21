const Consulta = require("../models/Consulta")
const Paciente = require("../models/Paciente")
const Medico = require("../models/Medico")
const PlanoSaude = require("../models/PlanoSaude")

class ConsultaController {

    async store(req, res) {
        try {
            const { paciente_id, medico_id, data_hora, descricao } = req.body

            if (!paciente_id || !medico_id || !data_hora) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            
            const paciente = await Paciente.findById(paciente_id)
            if (!paciente) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }

            
            if (!paciente.plano_id) {
                return res.status(400).json({ error: "Paciente sem plano ativo. É necessário ter um plano de saúde ativo para criar a consulta" })
            }

            
            const plano = await PlanoSaude.findById(paciente.plano_id)
            if (!plano) {
                return res.status(400).json({ error: "Plano de saúde não encontrado" })
            }

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const validade = new Date(plano.validade);
            validade.setHours(23, 59, 59, 999);

            if (validade < hoje) {
                return res.status(400).json({ error: "Plano de Saúde vencido. Não é possível criar uma consulta com o plano fora da validade" })
            }

            
            const medico = await Medico.findById(medico_id)
            if (!medico) {
                return res.status(404).json({ error: "Médico não encontrado" })
            }

            
            const createdConsulta = await Consulta.create(
                paciente_id,
                medico_id,
                paciente.plano_id,
                data_hora,
                descricao
            )

            return res.status(201).json(createdConsulta)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar consulta", details: error.message })
        }
    }

    async index(req, res) {
        try {
            const { dataInicial, dataFinal } = req.query

            const consultas = await Consulta.findAll(dataInicial, dataFinal)
            return res.status(200).json(consultas)

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar consultas", details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const consulta = await Consulta.findById(id)

            if (!consulta) {
                return res.status(404).json({ error: "Consulta não encontrada" })
            }

            return res.status(200).json(consulta)

        } catch (error) {
            return res.status(404).json({ error: "Erro ao buscar consulta", details: error.message })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { data_hora, descricao, status } = req.body

            const consulta = await Consulta.findById(id)

            if (!consulta) {
                return res.status(404).json({ error: "Consulta não encontrada" })
            }

            const consultaAtualizada = await Consulta.update(
                id,
                data_hora || consulta.data_hora,
                descricao || consulta.descricao,
                status || consulta.status
            )

            return res.status(200).json(consultaAtualizada)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar consulta", details: error.message })
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params

            const deleted = await Consulta.delete(id)

            if (!deleted) {
                return res.status(404).json({ error: "Consulta não encontrada" })
            }

            return res.status(200).json({ message: "Consulta excluída com sucesso" })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao excluir consulta", details: error.message })
        }
    }

}

module.exports = new ConsultaController()


