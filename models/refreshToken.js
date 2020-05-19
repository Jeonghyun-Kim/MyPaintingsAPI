module.exports = (sequelize, DataTypes) => {
  return sequelize.define('refreshToken', {
    value: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true
  });
};
