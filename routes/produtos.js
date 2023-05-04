// Importação das variáveis
const { Op } = require("sequelize");
const Produto = require("../database/produto");
const { Router } = require("express");


// Criação do grupo de rotas (/produtos);
const router = Router();

// Definição de Rotas

// POST
router.post("/produtos", async (req, res) => {
    // Coletar dados do req.body

    const { nome, preco, descricao, desconto, categoria } = req.body;

    try {
        const dataDesconto = new Date("2023-05-30T00:00:00.000Z");
        dataDesconto.setHours(0, 0, 0, 0);
        if (
            ["Higiene", "Brinquedos", "Conforto", "Alimentação", "Roupas"].includes(
                categoria
            ) &&
            desconto > 0 &&
            desconto < 100 &&
            dataDesconto >= new Date()
        ) {
            const novo = await Produto.create({
                nome,
                preco,
                descricao,
                desconto,
                dataDesconto: new Date(req.body.dataDesconto),
                categoria,
            });
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

// // GET
router.get("/produtos", async (req, res) => {
    const nome = req.query.nome;
    const categoria = req.query.categoria;

    const whereClause = {};
    if (nome) {
        whereClause.nome = { [Op.like]: `%${nome}%` };
    }
    if (categoria) {
        whereClause.categoria = { [Op.eq]: categoria };
    }

    const listaProdutos = await Produto.findAll({ where: whereClause });
    res.json(listaProdutos);
});

// GET BY ID (busca pelo id do produto)
router.get("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);
        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu, tente de novo" });
    }
});

// PUT
router.put("/produtos/:id", async (req, res) =>{
    // Dados do body
    const { nome, preco, descricao, desconto, dataDesconto, categoria } = req.body;
    const { id } = req.params;

    // Verificar se todos dados estão presentes
    if(!id || !nome || !preco || !descricao || !desconto || !dataDesconto || !categoria){
        return res.status(400).json({ message: "Dados inválidos" });
    }

    // Verificar se o produto existe
    const produto = await Produto.findByPk(id);
    if(!produto){
        return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Verificar se o desconto é válido
    if(desconto < 0 || desconto > 100){
        return res.status(400).json({ message: "Desconto inválido" });
    }

    // Verificar se a categoria é válida
    if( categoria !== "Higiene" && categoria !== "Brinquedos" && categoria !== "Conforto" && categoria !== "Alimentação" && categoria !== "Roupas"){
        return res.status(400).json({ message: "Categoria inválida" });
    }

    // Verificar se a data de desconto é válida
    const dataAtual = new Date();
    const novaData = new Date(Date.parse(dataDesconto));

    if (novaData < dataAtual) {
    return res.status(400).json({ message: "Data inválida" });
    }
    
    try{
        const produtoAtualizado = await Produto.update(
            {nome, preco, descricao, desconto, dataDesconto, categoria},
            { where: { id: req.params.id } }
        );
        res.status(201).json({message: "Produto atualizado"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu, tente de novo" });
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

module.exports = router;
