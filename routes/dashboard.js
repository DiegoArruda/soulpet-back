const Cliente = require("../database/cliente");
const { Router } = require("express");
const Pet = require("../database/pet");
const Produto = require("../database/produto");
const Agendamento = require("../database/agendamento");
const Servico = require("../database/servico");
const { connection } = require("../database/database");
const Endereco = require("../database/endereco");

const router = Router();

router.get('/dashboard', async (req, res) => {
    try {
        const totalClientes = await Cliente.count();
        const totalPets = await Pet.count();
        const totalProdutos = await Produto.count();
        const totalServicos = await Servico.count();
        const totalAgendamentos = await Agendamento.count();

        const agendamentosPorAno = await Agendamento.findAll({
            attributes: [
                [connection.fn('YEAR', connection.col('dataAgendada')), 'ano'],
                [connection.fn('COUNT', connection.col('*')), 'total']
            ],
            group: ['ano'],
            raw: true
        });

        const cidadeClientes = await Endereco.findAll({
            attributes: [
                'cidade',
                [connection.fn('COUNT', connection.col('*')), 'quantidade_enderecos']
            ],
            group: ['cidade'],
            raw: true
        });

        const tiposDePets = await Pet.findAll({
            attributes: [
                "tipo",
                [connection.fn("COUNT", connection.col("*")), "quantidade"]
            ],
            group: ["tipo"],
            raw: true
        });

        const agendamentosPorMesUltimos12meses = await Agendamento.findAll({
            attributes: [
                [connection.fn('MONTHNAME', connection.col('dataAgendada')), 'mes'],
                [connection.fn('COUNT', connection.col('*')), 'quantidade']
            ],
            where: {
                dataAgendada: {
                    [connection.Sequelize.Op.gte]: connection.fn('DATE_SUB', connection.fn('NOW'), connection.literal('INTERVAL 12 MONTH'))
                }
            },
            group: ['mes'],
            order: [['mes', 'ASC']],
            raw: true
        });

        const tiposServico = await Servico.findAll({
            attributes: [
                'nome',
                [connection.fn('COUNT', connection.col('*')), 'quantidade']
            ],
            group: ['nome'],
            raw: true
        });

        const tipoProdutos = await Produto.findAll({
            attributes: [
                "categoria",
                [connection.fn("COUNT", connection.col("*")), "quantidade"]
            ],
            group: ["categoria"],
            raw: true
        });


        res.status(200).json({
            totalClientes,
            totalPets,
            totalProdutos,
            totalServicos,
            totalAgendamentos,
            agendamentosPorAno,
            cidadeClientes,
            tiposDePets,
            agendamentosPorMesUltimos12meses,
            tiposServico,
            tipoProdutos
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Um erro aconteceu.');
    }
});

module.exports = router;
