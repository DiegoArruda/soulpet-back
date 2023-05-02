// Modelo para gerar a tabela Produtos no MySQL
// Mapeamento: cada propriedade vira uma coluna da tabela

// DataTypes = definir qual o tipo da coluna

const { DataTypes } = require("sequelize");
const { connection } = require("./database");
//
const Produto = connection.define("produto", {
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    desconto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dataDesconto: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        // validate: [validateDataDesconto, {message: "Data de desconto inválida"}]
    },
    categoria: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

// // Validação da data do desconto (não pode ser anterior ao dia atual)
// function validateDataDesconto(value){
//     const hoje = new Date();
//     const dataDesconto = new Date(value);
//     return dataDesconto >= hoje;
// }




module.exports = Produto;