module.exports = (sequelize, dataTypes) => {

  let alias = 'Users';
  
    let cols = {
      id_users: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING
        },
        surname: {
          type: dataTypes.STRING
        },
        dni: {
          type: dataTypes.STRING
        },
        email: {
          type: dataTypes.STRING
        },
        password: {
          type: dataTypes.STRING
        },
        avatar: {
          type: dataTypes.STRING
        },
        privileges_id : {
          type: dataTypes.INTEGER
        },
        createdAt: {
            type: dataTypes.DATE
        },
        updatedAt: {
            type: dataTypes.DATE
        },
        deletedAt: {
            type: dataTypes.DATE
        }
    };
  
    let config = {
        tableName: 'users',
        timestamps: true,
        paranoid: true
    };
  
    const Users = sequelize.define(alias, cols, config)
  
    Users.associate = function (models) {
      Users.belongsTo(models.Privileges, {
        foreignKey: "privileges_id",
        as: "privileges",
      }),
        Users.hasMany(models.Orders, {
          foreignKey: "user_id",
          as: "orders",
        });
    };
  
    return Users;
  }