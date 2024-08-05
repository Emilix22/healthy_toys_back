module.exports = (sequelize, dataTypes) => {

  let alias = 'Privileges';
  
    let cols = {
      id_privileges: {
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
        tableName: 'privileges',
        timestamps: true,
        paranoid: true
    };
  
    const Privileges = sequelize.define(alias, cols, config)
  
    Privileges.associate = function(models) {

        Privileges.hasMany(models.Users,{
            foreignKey: 'privileges_id',
            as: 'users'
        })
    }
  
    return Privileges;
  }