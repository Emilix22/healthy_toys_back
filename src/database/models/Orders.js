module.exports = (sequelize, dataTypes) => {

  let alias = 'Orders';
  
    let cols = {
      id_order: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: dataTypes.INTEGER
        },
        total: {
          type: dataTypes.DECIMAL(10,2)
        },
        shipping_method: {
          type: dataTypes.STRING
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
        tableName: 'orders',
        timestamps: true,
        paranoid: true
    };
  
    const Orders = sequelize.define(alias, cols, config)
  
    Orders.associate = function (models) {
      Orders.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "users",
      }),
        Orders.hasMany(models.OrderItems, {
          foreignKey: "order_id",
          as: "orderItems",
        });
    };
  
    return Orders;
  }