'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    return await this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(userId, offerId, commentId) {
    const offerByUser = await this._Offer.findOne({
      where: {
        id: offerId,
        userId
      }
    });

    if (!offerByUser) {
      return !!offerByUser;
    }

    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId
      }
    });

    return !!deletedRows;
  }

  async findAll(offerId) {
    return await this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

  async findOne(id, offerId) {
    return await this._Comment.findOne({
      where: {
        id,
        offerId
      }
    });
  }

}

module.exports = CommentService;
