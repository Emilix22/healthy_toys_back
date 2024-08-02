module.exports = (sequelize, dataTypes) => {

  let alias = 'Categories';
  
    let cols = {
      id_category: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
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
        tableName: 'categories',
        timestamps: true,
        paranoid: true
    };
  
    const Categories = sequelize.define(alias, cols, config)
  
    Categories.associate = function(models) {

        Categories.hasMany(models.Products,{
            foreignKey: 'id_category',
            as: 'products'
        })
    }
  
    return Categories;
  }