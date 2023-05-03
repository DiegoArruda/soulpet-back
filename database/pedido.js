const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");
const Produto = require("./produto");

const Pedido = connection.define("pedido", {
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

Cliente.hasMany(Pedido);
Pedido.belongsTo(Cliente);

Produto.hasMany(Pedido);
Pedido.belongsTo(Produto);

module.exports = Pedido;