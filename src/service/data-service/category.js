'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = this._offers.reduce((acc, offer) => {
      acc.add(...offer.category);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
