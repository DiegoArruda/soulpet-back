const Pedidos = require("../database/pedidos");
const Cliente = require("../database/cliente");
const Produto = require("../database/produto");

const { Router } = require("express");

const router = Router();
//
// Rota para listar todos os pedidos
router.get("/pedidos", async (req, res) => {
  const listaPedidos = await Pedidos.findAll({
    include: [Cliente, Produto], // traz junto os dados de cliente e produto
  });
  res.json(listaPedidos);
});

// Rota para mostrar um pedido específico
router.get("/pedidos/:codigo", async (req, res) => {
  const { codigo } = req.params;
  
    const pedidoId = await Pedidos.findByPk(codigo, {include: [Cliente, Produto]});
    if (pedidoId) {
      res.json(pedidoId);
    } else {
      res.status(404).json({ message: "Pet não encontrado." });
    }
});

// Rota para mostrar um pedido de acordo com o id do produto fornecido
router.get("/pedidos/produtos/:id", async (req, res) => {
  const id = req.params.id;
  const produtoeCliente = await Pedidos.findAll({
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

// Rota para mostrar um pedido de acordo com o id do cliente fornecido
router.get('/pedidos/clientes/:id', async (req, res) => {
  const id = req.params.id;
  const pedidos = await Pedidos.findAll({
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

router.post("/pedidos", async (req, res) => {
  const {codigo, quantidade, clienteId, produtoId} = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);
    const produto = await Produto.findByPk(produtoId);
    if (cliente && produto) {
      const pedido = await Pedidos.create({ codigo, quantidade, clienteId, produtoId});
      res.status(201).json(pedido);
    } else {
      res.status(404).json({ message: "Cliente ou Produto não encontrado." });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
})

router.put('/pedidos/:id', async (req, res) => {
  try {
    const pedidoAtualizado = req.body;
    const pedidoId = req.params.id;

    // Busca o pedido no banco de dados
    const pedido = await Pedidos.findByPk(pedidoId);

    // Verifica se o pedido existe
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Atualiza o pedido com os novos valores
    pedido.produto = pedidoAtualizado.produto || pedido.produto;
    pedido.quantidade = pedidoAtualizado.quantidade || pedido.quantidade;
    pedido.valor_unitario = pedidoAtualizado.valor_unitario || pedido.valor_unitario;

    // Salva as mudanças no banco de dados
    await pedido.save();

    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar pedido' });
  }
});

module.exports = router;