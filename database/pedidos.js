const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");
const Produto = require("./produto");

const Pedidos = connection.define("pedido", {
    codigo: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    },
    quantidade: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
})

// Relacionamento

Cliente.hasMany(Pedidos);
Pedidos.belongsTo(Cliente);

Produto.hasMany(Pedidos);
Pedidos.belongsTo(Produto);

module.exports = Pedidos;