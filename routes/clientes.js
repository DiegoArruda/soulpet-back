const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");
const { Router } = require("express");
const Pet = require("../database/pet");

// Criar o grupo de rotas (/clientes)
const router = Router();

//criação de pdf
const PDFDocument = require("pdfkit-table");

// Definição de rotas
router.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

// /clientes/1, 2
router.get("/clientes/:id", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco], // trás junto os dados de endereço
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});

//Get retornando um pdf com dados dos clientes
router.get('/cliente/relatorio', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [
        { model: Endereco, attributes: ['rua', 'numero', 'cep', 'cidade', 'uf'] },
        { model: Pet, attributes: ['nome'] }
      ],
    });

  let doc = new PDFDocument({ margin: 30, size: 'A4' });

  const rows = clientes.map(cliente => {
    const endereco = `${cliente.endereco.rua}, ${cliente.endereco.numero}, ${cliente.endereco.cep}, ${cliente.endereco.cidade}, ${cliente.endereco.uf}`;
    const pets = cliente.pets.map(pet => `- ${pet.nome}`).join('\n');
    return {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco,
      pets,
    };
  });
  
  const table = {
    headers: [
      { label: "ID", property: 'id', width: 30, renderer: null, align: 'center', valign: "center" },
      { label: "Nome", property: 'nome', width: 140, renderer: null, align: 'center', valign: "center" }, 
      { label: "E-mail", property: 'email', width: 110, renderer: null, align: 'center', valign: "center" }, 
      { label: "Telefone", property: 'telefone', width: 70, renderer: null, align: 'center', valign: "center" }, 
      { label: "Endereço", property: 'endereco', width: 110, renderer: null, align: 'center', valign: "center" }, 
      { label: "Pets", property: 'pets', width: 63, align: 'center', valign: "center" }
    ],
    rows: rows.map(row => [row.id, row.nome, row.email, row.telefone, row.endereco, row.pets])
  };
  
  doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      const {x, y, width, height} = rectCell;
      if(indexColumn === 0){
        doc
        .lineWidth(.5)
        .moveTo(x, y)
        .lineTo(x, y + height)
        .stroke();  
      }
      doc
      .lineWidth(.5)
      .moveTo(x + width, y)
      .lineTo(x + width, y + height)
      .stroke()
      .font("Helvetica").fontSize(8)
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
  doc.pipe(res);
  doc.end();
} catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar relatório de clientes.');
  }
});

router.post("/clientes", async (req, res) => {
  // Coletar os dados do req.body
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Dentro de 'novo' estará o o objeto criado
    const novo = await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }
    );

    res.status(201).json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// atualizar um cliente
router.put("/clientes/:id", async (req, res) => {
  // obter dados do corpo da requisão
  const { nome, email, telefone, endereco } = req.body;
  // obter identificação do cliente pelos parametros da rota
  const { id } = req.params;
  try {
    // buscar cliente pelo id passado
    const cliente = await Cliente.findOne({ where: { id } });
    // validar a existência desse cliente no banco de dados
    if (cliente) {
      // validar a existência desse do endereço passdo no corpo da requisição
      if (endereco) {
        await Endereco.update(endereco, { where: { clienteId: id } });
      }
      // atualizar o cliente com nome, email e telefone
      await cliente.update({ nome, email, telefone });
      res.status(200).json({ message: "Cliente editado." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

// excluir um cliente
router.delete("/clientes/:id", async (req, res) => {
  // obter identificação do cliente pela rota
  const { id } = req.params;
  // buscar cliente por id
  const cliente = await Cliente.findOne({ where: { id } });
  try {
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente removido." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
