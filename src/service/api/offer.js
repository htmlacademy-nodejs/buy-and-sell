'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const {adaptToClient} = require(`../lib/adapt-to-client`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, userId, categoryId, withComments} = req.query;

    let offers = {};

    if (userId) {
      offers.current = await offerService.findAll({userId, withComments});
      return res.status(HttpCode.OK).json(offers);
    }

    if (categoryId) {
      offers.current = await offerService.findPage({limit, offset, categoryId});
    } else {
      offers.recent = await offerService.findLimit({limit});
      offers.commented = await offerService.findLimit({limit, withComments: true});
    }

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const {userId, withComments} = req.query;

    const offer = await offerService.findOne({offerId, userId, withComments});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const data = await offerService.create(req.body);

    const adaptedOffer = adaptToClient(await offerService.findOne({offerId: data.id}));

    const io = req.app.locals.socketio;
    io.emit(`offer:create`, adaptedOffer);

    return res.status(HttpCode.CREATED)
      .json(data);
  });

  route.put(`/:offerId`, [routeParamsValidator, offerValidator], async (req, res) => {
    const {offerId} = req.params;

    const updated = await offerService.update({id: offerId, offer: req.body});

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const {userId} = req.body;

    const offer = await offerService.findOne({offerId});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedOffer = await offerService.drop({userId, offerId});

    if (!deletedOffer) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedOffer);
  });

  route.get(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
    const {offerId} = req.params;

    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
      .json(comments);

  });

  route.post(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService), commentValidator], async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
    const {offerId, commentId} = req.params;
    const {userId} = req.body;

    const comment = await commentService.findOne(commentId, offerId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = await commentService.drop(userId, offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
