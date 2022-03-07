'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@db/nn_chat',
  {
    logging: false
  }
);
const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT
    },
    postedBy: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

Post.sync();
module.exports = Post;