// Importação das variáveis
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

// GET (todos produtos)
router.get("/produtos", async (req, res) => {
    const produtos = await Produto.findAll();
    res.json(produtos);
});

// GET BY ID (busca pelo id do produto)
router.get("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);
        if(produto) {
            res.json(produto);
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu, tente de novo" });
    }
});

// GET (busca por query)
router.get("/produtos", async (req, res) => {
    try {
      const { nome, categoria } = req.query;
      if (nome) {
        const produtos = await Produto.findAll({
            where: {
                nome: {
                  [Op.like]: `%${nome}%`
                }
              }
        });
        res.json(produtos);
      } else if (categoria) {
        const produtos = await Produto.findAll({
          where: { categoria: categoria }
        });
        res.json(produtos);
      } else {
        res.status(404).json({ message: "Produto não encontrado" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Um erro aconteceu, tente de novo" });
    }
  });

// PUT
// DELETE

module.exports = router;
