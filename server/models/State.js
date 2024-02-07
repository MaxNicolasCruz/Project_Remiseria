import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

export const State = sequelize.define('State', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING(30)
    }
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});


State.hasMany(Service, { // Service-> Service es el valor de alias en Service.js
    as: "services", // El nombre del modelo pero en plural
    foreignKey: "state"
})

Service.belongsTo(State, { // models.State -> States es el valor de alias en States.js
    as: "stateUser",
    foreignKey: "state"
})