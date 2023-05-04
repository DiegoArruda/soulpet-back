// Importações principais e variáveis de ambiente
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON
app.use(morgan("dev"));

// Configurações de acesso
app.use(cors({ origin: "http://localhost:3000" }));

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão

// Definição de Rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");
const rotasServicos = require("./routes/servicos");
const rotasProdutos = require("./routes/produtos");
const rotasAgendamentos = require("./routes/agendamentos");
const rotasPedidos = require("./routes/pedidos");
const rotasDashboard = require("./routes/dashboard")

// Juntar ao app as rotas dos arquivos
app.use(rotasClientes); // Configurar o grupo de rotas no app
app.use(rotasPets);
app.use(rotasServicos);
app.use(rotasProdutos);
app.use(rotasAgendamentos);
app.use(rotasPedidos);
app.use(rotasDashboard);

// Escuta de eventos (listen)
app.listen(3001, () => {
  // Gerar as tabelas a partir do model
  // Force = apaga tudo e recria as tabelas
  connection.sync();
  console.log("Servidor rodando em http://localhost:3001/");
});
