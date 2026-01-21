const Relatorio = require("../models/Relatorio")

class RelatorioController {

    async buscaAgendamentos(req, res) {
        try {
            const { dataInicial, dataFinal } = req.query

            if (!dataInicial || !dataFinal) {
                return res.status(400).json({ error: "Parâmetros dataInicial e dataFinal são obrigatórios" })
            }

            const resultado = await Relatorio.buscaAgendamentos(dataInicial, dataFinal)

            return res.status(200).json({
                periodo: {
                    dataInicial,
                    dataFinal
                },
                total_dias: resultado.length,
                agendamentos: resultado
            })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar agendamentos", details: error.message })
        }
    }

    async buscaAgendamentosPorMedico(req, res) {
        try {
            const { dataInicial, dataFinal } = req.query

            if (!dataInicial || !dataFinal) {
                return res.status(400).json({ error: "Parâmetros dataInicial e dataFinal são obrigatórios" })
            }

            const resultado = await Relatorio.buscaAgendamentosPorMedico(dataInicial, dataFinal)

            return res.status(200).json({
                periodo: {
                    dataInicial,
                    dataFinal
                },
                agendamentos_por_medico: resultado
            })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar agendamentos por médico", details: error.message })
        }
    }

    async buscaAgendamentosPorPaciente(req, res) {
        try {
            const { dataInicial, dataFinal } = req.query

            if (!dataInicial || !dataFinal) {
                return res.status(400).json({ error: "Parâmetros dataInicial e dataFinal são obrigatórios" })
            }

            const resultado = await Relatorio.buscaAgendamentosPorPaciente(dataInicial, dataFinal)

            return res.status(200).json({
                periodo: {
                    dataInicial,
                    dataFinal
                },
                agendamentos_por_paciente: resultado
            })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar agendamentos por paciente", details: error.message })
        }
    }

    async resumoConsultasPorStatus(req, res) {
        try {
            const { dataInicial, dataFinal } = req.query

            if (!dataInicial || !dataFinal) {
                return res.status(400).json({ error: "Parâmetros dataInicial e dataFinal são obrigatórios" })
            }

            const resultado = await Relatorio.resumoConsultasPorStatus(dataInicial, dataFinal)

            return res.status(200).json({
                periodo: {
                    dataInicial,
                    dataFinal
                },
                resumo_por_status: resultado
            })

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar resumo de consultas", details: error.message })
        }
    }

}

module.exports = new RelatorioController()
