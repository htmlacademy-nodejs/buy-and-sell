'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers();
  res.render(`my-tickets`, {
    user,
    offers
  });
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true});
  res.render(`comments`, {
    user,
    offers: offers.slice(0, 3)
  });
});

module.exports = myRouter;
