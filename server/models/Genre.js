import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";


// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

export const Genre = sequelize.define('Genre', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    genre: {
        type: DataTypes.STRING(30)
    }
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});



Genre.hasMany(Client, { // Client-> Client es el valor de alias en Client.js
    as: "clients", // El nombre del modelo pero en plural
    foreignKey: "genre"
})

Client.belongsTo(Genre, { // models.Genre -> Genres es el valor de alias en genres.js
    as: "genreUser",
    foreignKey: "genre"
})
