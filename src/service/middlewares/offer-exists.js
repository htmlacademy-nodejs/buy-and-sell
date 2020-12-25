'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;
  const offer = await service.findOne(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);
  }

  return next();
};
