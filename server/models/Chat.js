import { DataTypes } from 'sequelize';
import { sequelize } from "../database/model.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

const Chat = sequelize.define('Chat', {
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
    id_type_message: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE
    }
});

// relations

Client.hasMany(Chat, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Service.hasMany(Chat, {
    foreignKey: 'id_service',
    targetKey: 'id'
})

Chat.belongsTo(Client, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Chat.belongsTo(Service, {
    foreignKey: 'id_service',
    targetKey: 'id'
})