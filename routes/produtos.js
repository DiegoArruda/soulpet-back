// Importação das variáveis
const Produto = require("../database/produto");
const { Router } = require("express");

// Criação do grupo de rotas (/produtos);
const router = Router();

// Definição de Rotas

// POST
router.post("/produtos", async (req, res) => {
    // Coletar dados do req.body
    const { nome, preco, descricao, desconto, dataDesconto, categoria } = req.body;
    try {
        const novo = await Produto.create(
            { nome, preco, descricao, desconto, dataDesconto, categoria }
        );
        if (
            ["Higiene", "Brinquedos", "Conforto", "Alimentação", "Roupas"].includes(categoria)
            && desconto > 0 && desconto < 100
            && new Date(dataDesconto) > new Date()
        ) {
            res.status(201).json(novo);
            console.log(novo);
        } else {
            res.status(400).json({ message: "Dados do produto inválidos" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});
// DELETE

router.delete("/produtos/:id", async (req, res) => {
    // Precisamos checar se o produto existe antes de apagar
    const produto = await Produto.findByPk(req.params.id);

    try {

        if (produto) {
            // produto existe, podemos apagar
            await produto.destroy();
            res.json({ message: "O produto foi removido." });
        } else {
            res.status(404).json({ message: "O produto não foi encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }


});

// DELETE

router.delete("/pedidos/clientes/:id", async (req, res) => {
    // Precisamos checar se o pedido existe antes de apagar
    const pedido = await pedido.findByPk(req.params.id);

    try {

        if (pedido) {
            // pedido existe, podemos apagar
            await pedido.destroy();
            res.json({ message: "O pedido foi removido." });
        } else {
            res.status(404).json({ message: "O pedido não foi encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }

});



// DELETE

router.delete("/pedidos/produtos/:id", async (req, res) => {
    // Precisamos checar se o pedido existe antes de apagar
    const pedido = await pedido.findByPk(req.params.id);

    try {

        if (pedido) {
            // pedido existe, podemos apagar
            await pedido.destroy();
            res.json({ message: "O pedido foi removido." });
        } else {
            res.status(404).json({ message: "O pedido não foi encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }


});



// GET
// GET BY ID
// PUT
// DELETE


module.exports = router;