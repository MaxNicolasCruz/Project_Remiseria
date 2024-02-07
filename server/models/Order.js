import { DataTypes } from 'sequelize';
import { sequelize } from "../database/model.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

const Order = sequelize.define('Order', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_service: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE
    },
    method_pay: {
        type: DataTypes.INTEGER
    }
});

// relations

Client.hasMany(Order, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Service.hasMany(Order, {
    foreignKey: 'id_service',
    targetKey: 'id'
})

Order.belongsTo(Client, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Order.belongsTo(Service, {
    foreignKey: 'id_service',
    targetKey: 'id'
})