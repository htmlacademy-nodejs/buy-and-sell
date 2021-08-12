'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop({userId, offerId}) {
    const deletedRow = await this._Offer.destroy({
      where: {
        id: offerId,
        userId
      }
    });

    return !!deletedRow;
  }

  async findAll({userId, withComments}) {
    const options = {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        userId
      }
    };

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });

      options.order.push([
        {model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`
      ]);
    }

    let offers = await this._Offer.findAll(options);

    offers = offers.map((item) => item.get());

    if (withComments) {
      offers = offers.filter((offer) => offer.comments.length > 0);
    }

    return offers;
  }

  async findOne({offerId, userId, withComments}) {
    const options = {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      where: [{
        id: offerId
      }]
    };

    if (userId) {
      options.where.push({userId});
    }

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Offer.findOne(options);
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, rows};
  }

  async findLimit({limit, withComments}) {
    if (!withComments) {
      const options = {
        limit,
        include: [
          Aliase.CATEGORIES
        ],
        order: [
          [`createdAt`, `DESC`]
        ]
      };

      return await this._Offer.findAll(options);
    }

    const options = {
      subQuery: false,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Offer.id`,
        `categories.id`,
        `categories->OfferCategory.OfferId`,
        `categories->OfferCategory.CategoryId`
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    let offers = await this._Offer.findAll(options);

    offers = offers
      .map((offer) => offer.get())
      .filter((offer) => offer.commentsCount > 0);

    return offers.slice(0, limit);
  }

  async update({id, offer}) {
    const affectedRows = await this._Offer.update(offer, {
      where: {
        id,
        userId: offer.userId
      }
    });

    const updatedOffer = await this._Offer.findOne({
      where: {
        id,
        userId: offer.userId
      }
    });

    await updatedOffer.setCategories(offer.categories);

    return !!affectedRows;
  }
}

module.exports = OfferService;
