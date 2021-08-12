'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async findAll(withCount) {
    if (withCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._OfferCategory,
          as: Aliase.OFFER_CATEGORIES,
          attributes: []
        }]
      });

      return categories.map((it) => it.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId);
  }

  async findPage(categoryId, limit, offset) {
    const offersIdByCategory = await this._OfferCategory.findAll({
      attributes: [`OfferId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const offersId = offersIdByCategory.map((offerIdItem) => offerIdItem.OfferId);

    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: offersId
      },
      distinct: true
    });

    return {count, offersByCategory: rows};
  }
}

module.exports = CategoryService;
