import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";
import { Order } from "./Order.js";

export const Comment = sequelize.define('Comment', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment: {
        type: DataTypes.TEXT
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_service: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_order:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    rating: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    timestamps: false 
});

// relations


Service.hasMany(Comment, {
    foreignKey: 'id_service',
    targetKey: 'id'
})


Comment.belongsTo(Service, {
    foreignKey: 'id_service',
    targetKey: 'id'
})


Order.hasOne(Comment,{
    foreignKey: 'id_order',
    sourceKey: 'id'
})

Comment.belongsTo(Order,{
    foreignKey: 'id_order',
    targetKey: 'id'
})