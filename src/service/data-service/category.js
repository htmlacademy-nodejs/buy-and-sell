'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = this._offers.reduce((acc, offer) => {
      for (const category of offer.category) {
        acc.add(category);
      }
      
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
