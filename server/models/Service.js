import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";


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
        type: DataTypes.ENUM('Male', 'Female', 'Other')
    },
    description:{
        type: DataTypes.TEXT()
    },
    date_of_birth: {
        type: DataTypes.STRING(30)
    },
    number_phone: {
        type: DataTypes.STRING(15)
    },
    city: {
        type: DataTypes.STRING(30)
    },
    country: {
        type: DataTypes.STRING(30)
    },
    number_document: {
        type: DataTypes.STRING(15)
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
        type: DataTypes.ENUM('Paypal', 'Efectivo', 'Mercado Pago', 'Uala')
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
        type: DataTypes.ENUM('En servicio','Fuera de Servicio','En Pedido')
    },
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});

