const { Router } = require("express")
const PacienteController = require("./controllers/PacienteController")
const MedicoController = require("./controllers/MedicoController")
const PlanoSaudeController = require("./controllers/PlanoSaudeController")
const ConsultaController = require("./controllers/ConsultaController")
const MedicoPlanoController = require("./controllers/MedicoPlanoController")

const routes = Router()

routes.get("/", (req, res) => {
    return res.status(200).json({ message: "Server on" })
})

routes.post("/pacientes", PacienteController.store)
routes.get("/pacientes", PacienteController.index)
routes.get("/pacientes/:id", PacienteController.show)
routes.put("/pacientes/:id", PacienteController.update)
routes.delete("/pacientes/:id", PacienteController.destroy)

routes.post("/medicos", MedicoController.store)
routes.get("/medicos", MedicoController.index)
routes.get("/medicos/:id", MedicoController.show)
routes.put("/medicos/:id", MedicoController.update)
routes.delete("/medicos/:id", MedicoController.destroy)

routes.post("/planos", PlanoSaudeController.store)
routes.get("/planos", PlanoSaudeController.index)
routes.get("/planos/:id", PlanoSaudeController.show)
routes.put("/planos/:id", PlanoSaudeController.update)
routes.delete("/planos/:id", PlanoSaudeController.destroy)

routes.post("/consultas", ConsultaController.store)
routes.get("/consultas", ConsultaController.index)
routes.get("/consultas/:id", ConsultaController.show)
routes.put("/consultas/:id", ConsultaController.update)
routes.delete("/consultas/:id", ConsultaController.destroy)

routes.post("/medicos-planos", MedicoPlanoController.store)
routes.get("/medicos/:medico_id/planos", MedicoPlanoController.index)
routes.delete("/medicos/:medico_id/planos/:plano_id", MedicoPlanoController.destroy)

module.exports = routes
