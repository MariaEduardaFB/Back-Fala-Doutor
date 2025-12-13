const { Pacientes, PlanoSaude } = require("../app/models")

class PacienteController {

    async store(req, res) {
        try {

            const { nome, cpf, telefone, plano_id } = req.body

            const pacienteAlreadyExists = await Pacientes.findOne({ where: { cpf } })

            if (pacienteAlreadyExists) {
                return res.status(400).json({ error: "Paciente já cadastrado" })
            }

            if (!nome || !cpf || !telefone) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" })
            }

            const createdPaciente = await Pacientes.create({ nome, cpf, telefone, plano_id })
            
            const pacienteComPlano = await Pacientes.findByPk(createdPaciente.id, {
                include: [{ model: PlanoSaude, as: 'PlanoSaude' }]
            })
            
            
            const resultado = pacienteComPlano.toJSON();
            if (resultado.PlanoSaude) {
                resultado.PlanoSaude.status = resultado.PlanoSaude.validade 
                    ? (new Date(resultado.PlanoSaude.validade) >= new Date() ? 'ativo' : 'inativo')
                    : 'inativo';
            }
            
            return res.status(201).json(resultado)

        } catch (error) {
            return res.status(400).json({ error: "Erro ao cadastrar paciente", details: error.message })
        }


    }

    async index(req, res) {
        try {
            const pacientes = await Pacientes.findAll({
                include: [{ model: PlanoSaude, as: 'PlanoSaude' }]
            })
            
            console.log('Total de pacientes:', pacientes.length)
            if (pacientes.length > 0) {
                console.log('Primeiro paciente:', JSON.stringify(pacientes[0], null, 2))
            }
            
            
            const pacientesComStatus = pacientes.map(p => {
                const pacienteJSON = p.toJSON();
                if (pacienteJSON.PlanoSaude) {
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    const validade = new Date(pacienteJSON.PlanoSaude.validade);
                    validade.setHours(23, 59, 59, 999);
                    pacienteJSON.PlanoSaude.status = validade >= hoje ? 'ativo' : 'inativo';
                }
                return pacienteJSON;
            });
            
            console.log('Pacientes com status:', JSON.stringify(pacientesComStatus[0], null, 2))
            
            return res.status(200).json(pacientesComStatus)
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar pacientes", details: error.message })
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const paciente = await Pacientes.findByPk(id, {
                include: [{ model: PlanoSaude, as: 'PlanoSaude' }]
            })

            if (!paciente) {
                return res.status(404).json({ error: "Paciente não encontrado" })
            }
            
            
            console.log('Paciente ID:', id)
            console.log('Paciente encontrado:', JSON.stringify(paciente, null, 2))
            
           
            const pacienteJSON = paciente.toJSON();
            if (pacienteJSON.PlanoSaude) {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const validade = new Date(pacienteJSON.PlanoSaude.validade);
                validade.setHours(23, 59, 59, 999);
                pacienteJSON.PlanoSaude.status = validade >= hoje ? 'ativo' : 'inativo';
            }
            
            console.log('Paciente com status:', JSON.stringify(pacienteJSON, null, 2))
            
            return res.status(200).json(pacienteJSON)
        } catch (error) {
            return res.status(404).json({ error: "Erro ao buscar paciente", details: error.message })
        }

    }

    async update(req, res) {

        try {

            const { id } = req.params
            const { nome, cpf, telefone, plano_id } = req.body

            await Pacientes.update(
                { nome, cpf, telefone, plano_id },
                { where: { id: id } }
            )

            const pacienteAtualizado = await Pacientes.findByPk(id, {
                include: [{ model: PlanoSaude, as: 'PlanoSaude' }]
            })
            
            
            const pacienteJSON = pacienteAtualizado.toJSON();
            if (pacienteJSON.PlanoSaude) {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const validade = new Date(pacienteJSON.PlanoSaude.validade);
                validade.setHours(23, 59, 59, 999);
                pacienteJSON.PlanoSaude.status = validade >= hoje ? 'ativo' : 'inativo';
            }

            return res.status(200).json(pacienteJSON)

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