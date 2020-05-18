module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/i
      }
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    num_fans: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    profile_pic_src: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    profile_msg: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true
  });
};
