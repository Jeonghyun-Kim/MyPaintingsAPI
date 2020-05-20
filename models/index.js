const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NONE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'db_config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Painting = require('./painting')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.RefreshToken = require('./refreshToken')(sequelize, Sequelize);

db.User.hasMany(db.Painting);

db.User.hasOne(db.RefreshToken);

db.User.belongsToMany(db.Painting, { through: 'PaintingLike', foreignKey: 'userId' });
db.Painting.belongsToMany(db.User, { through: 'PaintingLike', foreignKey: 'paintingId' });

db.Painting.hasMany(db.Product);

db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow'
});

module.exports = db;
