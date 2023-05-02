const { Op } = require("sequelize");
const Servico = require("../database/servico");
const { Router } = require("express");
const Agendamento = require("../database/agendamento");
const router = Router();



//LISTANDO SERVIÇO
router.get("/servicos", async (req, res) => {
    const { realizada, dataAgendada } = req.query;
    
    try {
        if(realizada || dataAgendada){
            const servicos = await Servico.findAll({
            where: {},
            include: [
                {
                    model: Agendamento,
                    where: {
                        [Op.or]: [
                            { realizada: {[Op.eq]: realizada} },
                            { dataAgendada: { [Op.eq]: dataAgendada } },
                        ]},  
                    required: true,
                },
            ],
        });
        res.status(200).json(servicos);
        } else {
            const servicos = await Servico.findAll({
                where: {},
                include: [Agendamento]
            });
            res.status(200).json(servicos);
        }
        


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

//LISTANDO POR ID
router.get("/servicos/:id", async (req, res) => {
    const { id } = req.params
    const servico = await Servico.findByPk(id, {
        include: [Agendamento], // trás junto os dados de endereço
    });

    if (servico) {
        res.json(servico);
    } else {
        res.status(404).json({ message: "Usuário não encontrado." });
    }
});



//ADICIONANDO SERVIÇO
router.post("/servicos", async (req, res) => {
    const { nome, preco } = req.body

    try {
        const validNome = (nome) => nome.length < 3
        if (!nome || !preco) {
            return res.status(404).json({ message: "Nome ou preço inválido." });
        }
        if (validNome(nome)) {
            return res.status(404).json({ message: "Nome inválido. É preciso ter 3 caracteres ou mais." });
        }

        const novoServico = await Servico.create(
            { nome, preco }
        )
        res.status(201).json(novoServico);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
})


//ATUALIZANDO SERVIÇOS 
router.put("/servicos/:id", async (req, res) => {
    const { nome, preco } = req.body;
    const { id } = req.params;

    try {
        const servico = await Servico.findByPk(id);
        const validNome = (nome) => nome.length < 3
        if (servico) {
            if (!nome || !preco) {
                return res.status(404).json({ message: "Nome ou preço inválido." });
            }
            if (validNome(nome)) {
                return res.status(404).json({ message: "Nome inválido. É preciso ter 3 caracteres ou mais." });
            }

            await servico.update({ nome, preco });
            res.status(200).json({ message: "Serviço editado." });
        } else {
            res.status(404).json({ message: "Serviço não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "um erro aconteceu." })
    }
})

module.exports = router;