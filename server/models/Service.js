import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

import { Genre } from "./Genre.js"

export const Service = sequelize.define('Service', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(30)
    },
    password: {
        type: DataTypes.STRING(100)
    },
    name: {
        type: DataTypes.STRING(30)
    },
    last_name: {
        type: DataTypes.STRING(30)
    },
    genre: {
        type: DataTypes.INTEGER
    },
    date_of_birth: {
        type: DataTypes.STRING(30)
    },
    number_phone: {
        type: DataTypes.INTEGER
    },
    city: {
        type: DataTypes.STRING(30)
    },
    country: {
        type: DataTypes.STRING(30)
    },
    number_document: {
        type: DataTypes.INTEGER
    },
    image: {
        type: DataTypes.STRING(100)
    },
    vehicle_type: {
        type: DataTypes.STRING(30)
    },
    working_hours: {
        type: DataTypes.INTEGER
    },
    method_of_payment: {
        type: DataTypes.INTEGER
    },
    orders: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rating: {
        allowNull: true,
        type: DataTypes.INTEGER
    },
    state: {
        type: DataTypes.INTEGER
    },
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});


Genre.hasMany(Service, { // Service-> Service es el valor de alias en Service.js
    as: "services", // El nombre del modelo pero en plural
    foreignKey: "genre"
})

Service.belongsTo(Genre, { // models.Genre -> Genres es el valor de alias en genres.js
    as: "genreUser",
    foreignKey: "genre"
})