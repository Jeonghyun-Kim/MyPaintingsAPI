module.exports = (sequelize, DataTypes) => {
  return sequelize.define('refreshToken', {
    refresh_token: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true
  });
};
