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
          type: dataTypes.DECIMAL(10, 2)
        },
        description: {
          type: dataTypes.STRING
        },
        image1: {
          type: dataTypes.STRING
        },
        image2: {
          type: dataTypes.STRING
        },
        image3: {
          type: dataTypes.STRING
        },
        image4: {
          type: dataTypes.STRING
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