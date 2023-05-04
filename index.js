// Importações principais e variáveis de ambiente
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const LogMorgan = require("./model/LogMorgan");
const mongoose = require("mongoose");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON
app.use(morgan("dev"));

// Configurações de acesso
app.use(cors({ origin: "http://localhost:3000" }));

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão

mongoose.connect("mongodb+srv://gustavo:7f04dabcd@cluster0.5nv4xhx.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("banco de dados conectado"))
.catch(() => console.log("Deu ruim"));
app.use(morgan('combined', {
  stream: {
    write: async function (log) {
      try {
        const novoLog = new LogMorgan({ log });
        await novoLog.save();
      } catch (err) {
        console.log(err);
      }
    }
  }
}));

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