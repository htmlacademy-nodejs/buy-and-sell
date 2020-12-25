"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers}) => {
  const {Category, Offer} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(
        offer.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });
  await Promise.all(offerPromises);
};
