import { DataTypes } from 'sequelize';
import { sequelize } from "../database/model.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

const Comment = sequelize.define('Comment', {
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
    rating: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    timestamps: true // Opcional, si deseas registrar createdAt y updatedAt
});

// relations

Client.hasMany(Comment, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Service.hasMany(Comment, {
    foreignKey: 'id_service',
    targetKey: 'id'
})

Comment.belongsTo(Client, {
    foreignKey: 'id_client',
    sourceKey: 'id'
})

Comment.belongsTo(Service, {
    foreignKey: 'id_service',
    targetKey: 'id'
})