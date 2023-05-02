const Agendamento = require("../database/agendamento");
const { Router } = require("express");

const Pet = require("../database/pet");
const Servico = require("../database/servico");

const router = Router();

//Listagem de agendamentos
router.get("/agendamentos", async (req, res) => {
  try {
    const listaAgendamentos = await Agendamento.findAll();
    res.json(listaAgendamentos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/agendamentos", async (req, res) => {
  const { dataAgendada, petId, servicoId } = req.body;

  try {
    const pet = await Pet.findByPk(petId);
    const servico = await Servico.findByPk(servicoId);
    if (pet && servico) {
      const agendamento = await Agendamento.create({
        dataAgendada,
        petId,
        servicoId,
      });
      res.status(201).json({
        message: "Agendamento criado com sucesso",
        agendamento: agendamento,
      });
    } else res.status(404).json({ message: "Pet ou Serviço não encontrado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
