const Users = require("./users");

module.exports = (sequelize, DataTypes) => {
    const tasks = sequelize.define('tasks', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        tableName: 'tasks',
    });
    tasks.associate = (models) => {
        tasks.belongsTo(models.users, {
            foreignKey: 'userId'
        });
    }
    return tasks;
}