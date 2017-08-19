module.exports = function(sequelize, DataType) {
    var User = sequelize.define("User", {
      user_id:{
        type: DataType.STRING,
        allowNull: false,
        primaryKey:true
      },
      user_password:{
        type: DataType.STRING,
        allowNull: false
      },
      user_first_name:{
        type: DataType.STRING,
        allowNull: false
      },
      user_last_name:{
          type: DataType.STRING,
          allowNull: false
      },
      user_optimum_payment_method: {
        type: DataType.STRING,
        defaultValue: "-"
      }
    });
    
    User.associate = function(models) {
        User.hasMany(models.Loan, {});
      };
    return User;
  };
