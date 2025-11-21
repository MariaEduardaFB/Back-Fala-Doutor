const { Router } = require("express")
const PacienteController = require("./controllers/PacienteController")
const MedicoController = require("./controllers/MedicoController")

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

module.exports = routes
