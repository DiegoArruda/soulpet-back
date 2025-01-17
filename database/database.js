// database.js = arquivo de conexão com o banco de dados
// ele vai ler as variáveis de ambiente e tentar conectar ao MySQL

const { Sequelize } = require("sequelize");

// Criamos o objeto de conexão
const connection = new Sequelize(
  process.env.DB_NAME, // nome reservado para o database
  process.env.DB_USER, // usuário reservado para conexão
  process.env.DB_PASSWORD, // senha para acesso
  {
    // informações adicionais da conexão
    host: process.env.DB_HOST, // endereço (banco local)d
    dialect: "mysql", // o banco utilizado
  }
);

//Bunyan
var bunyan = require("bunyan");
var log = bunyan.createLogger({ name: "soulpet-app" });

// Estabelecer conexão usando o objeto
async function authenticate(connection) {
  try {
    // Tentar estabelecer conexão (usar as informações passadas acima)
    await connection.authenticate();
    log.info("Conexão estabelecida com sucesso!");
  } catch (err) {
    // err = objeto que guarda detalhes sobre o erro que aconteceu
    log.warn(err);
  }
}

module.exports = { connection, authenticate };
