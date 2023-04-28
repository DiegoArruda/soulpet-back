const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Pet = require("./pet");
const Servico = require("./servico");

const Agendamento = connection.define("Agendamento", {
  dataAgendada: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  realizada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  PetsId: {
    type: DataTypes.INTEGER,
    references: {
      model: Pet, // 'Movies' would also work
      key: "id",
    },
  },
  ServicosId: {
    type: DataTypes.INTEGER,
    references: {
      model: Servico,
      key: "id",
    },
  },
});

//Relacionamento Relacionamento Pet - Agendamento 1:N, Servico - Agendamento 1:N
Pet.hasMany(Agendamento);
Servico.hasMany(Agendamento);

module.exports = Agendamento;