'use strict';

const MAX_LENGTH_DESCRIPTION = 55;

const getCategories = (categories) => {
  return categories.map((category) => ({
    id: category.id,
    name: category.name
  }));
};

const adaptToClient = (offerData) => {
  const adaptedOffer = {
    'id': offerData.id,
    'createdAt': offerData.createdAt,
    'title': offerData.title,
    'description': offerData.description.slice(0, MAX_LENGTH_DESCRIPTION),
    'picture': offerData.picture,
    'sum': offerData.sum,
    'type': offerData.type,
    'categories': getCategories(offerData.categories)
  };

  return adaptedOffer;
};

module.exports = {
  adaptToClient
};
