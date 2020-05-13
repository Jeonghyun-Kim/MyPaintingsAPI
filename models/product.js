module.exports = (sequelize, DataTypes) => {
  return sequelize.define('product', {
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    image_src: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNULL: true
    },
    on_sale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    num_like: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    paranoid: true
  });
};
