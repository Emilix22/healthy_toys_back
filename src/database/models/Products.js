module.exports = (sequelize, dataTypes) => {

  let alias = 'Products';
  
    let cols = {
      id_product: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING
        },
        category_id: {
          type: dataTypes.INTEGER
        },
        price: {
          type: dataTypes.FLOAT
        },
        description: {
          type: dataTypes.STRING
        },
        image: {
          type: dataTypes.STRING
        },
        quantity: {
          type: dataTypes.INTEGER
        },
        promotion: {
          type: dataTypes.BOOLEAN
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
        tableName: 'products',
        timestamps: true,
        paranoid: true
    };
  
    const Products = sequelize.define(alias, cols, config)
  
    Products.associate = function(models) {

      Products.belongsTo(models.Categories,{
          foreignKey: 'category_id',
          as: 'categories'
      })

    }
  
    return Products;
  }