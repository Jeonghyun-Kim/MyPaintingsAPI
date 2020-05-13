module.exports = (sequelize, DataTypes) => {
  return sequelize.define('painting', {
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
    num_like: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    view: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    paranoid: true
  });
};
