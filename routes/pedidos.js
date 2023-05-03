const Produto = require("../database/produto");
const Cliente = require("../database/cliente");
const Pedido = require("../database/pedido");

const { Router } = require("express");

// Criar o grupo de rotas (/pedidos)
const router = Router();

router.post("/pedidos", async (req, res) => {
    const { codigo, quantidade, clienteId, produtoId} = req.body;
  
    try {
      const cliente = await Cliente.findByPk(clienteId);
      if (cliente) {
        const pet = await Pedido.create({ codigo, quantidade, clienteId, produtoId});
        res.status(201).json(pet);
      } else {
        res.status(404).json({ message: "Cliente não encontrado." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Um erro aconteceu." });
    }
  });

  router.get("/pedidos", async (req, res) => {
    const listaPedidos = await Pedido.findAll( {include: [Cliente, Produto]});
    res.json(listaPedidos);
  });
  
  router.get("/pedidos/:codigo", async (req, res) => {
    const { codigo } = req.params;
  
    const pedidoId = await Pedido.findByPk(codigo, {include: [Cliente, Produto]});
    if (pedidoId) {
      res.json(pedidoId);
    } else {
      res.status(404).json({ message: "Pedido não encontrado." });
    }
  });
  
  router.get("/pedidos/produtos/:id", async (req, res) => {
    const id = req.params.id;
    const produtoeCliente = await Pedido.findAll({
      include: [
        {
          model: Produto,
          where: { id: id },
        },
        {
          model: Cliente,
        },
      ],
    });
    if (produtoeCliente)
    {
      res.json(produtoeCliente)
    }
    else {
      res.json({ error})
    }
  });
  
  router.get('/pedidos/clientes/:id', async (req, res) => {
    const id = req.params.id;
    const pedidos = await Pedido.findAll({
      where: { ClienteId: id },
      include: [Produto],
    });
  
    if (pedidos) {
      res.json(pedidos)
    }
    else {
      res.json({error})
    }
  
  });

  router.put('/pedidos/:codigo', async (req, res) => {
    const codigo = req.params.codigo;
    const pedido = await Pedido.findByPk(codigo);
  
    if (!pedido) {
      return res.status(404).send('Pedido não encontrado');
    }
  
    const { quantidade, clienteId, produtoId } = req.body;
  
    if (!quantidade || !clienteId || !produtoId) {
      return res.status(400).send('Campos inválidos');
    }
  
    try {
      await pedido.update({ quantidade, clienteId, produtoId });
  
      res.send(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar pedido');
    }
  });

  module.exports = router;