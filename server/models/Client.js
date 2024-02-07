import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

export const Client = sequelize.define('Client', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
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
    city: {
        type: DataTypes.STRING(30)
    },
    country: {
        type: DataTypes.STRING(30)
    },
    number_phone: {
        type: DataTypes.INTEGER
    },
    number_document: {
        type: DataTypes.INTEGER
    },
    image: {
        type: DataTypes.STRING(100)
    },
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});

