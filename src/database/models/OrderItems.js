module.exports = (sequelize, dataTypes) => {

  let alias = 'OrderItems';
  
    let cols = {
      id_orderItem: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: dataTypes.INTEGER
        },
        product_id: {
          type: dataTypes.INTEGER
        },
        name: {
          type: dataTypes.STRING
        },
        color: {
          type: dataTypes.STRING
        },
        price: {
          type: dataTypes.DECIMAL(10, 2)
        },
        quantity: {
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
        tableName: 'orderItems',
        timestamps: true,
        paranoid: true
    };
  
    const OrderItems = sequelize.define(alias, cols, config)
  
    OrderItems.associate = function(models) {

      OrderItems.belongsTo(models.Orders,{
          foreignKey: 'order_id',
          as: 'orders'
      })

    }
  
    return OrderItems;
  }