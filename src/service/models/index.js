"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);

class OfferCategory extends Model {

}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const User = defineUser(sequelize);

  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  OfferCategory.init({}, {sequelize});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  User.hasMany(Offer, {as: Aliase.OFFERS, foreignKey: `userId`});
  Offer.belongsTo(User, {as: Aliase.USER, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliase.USER, foreignKey: `userId`});

  return {Category, Comment, Offer, OfferCategory, User};
};

module.exports = define;
