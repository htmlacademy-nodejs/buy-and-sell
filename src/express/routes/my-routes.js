'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const offers = await api.getOffers({userId: user.id});

  res.render(`my-tickets`, {
    user,
    offers
  });
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  const offers = await api.getOffers({userId: user.id, withComments: true});

  res.render(`comments`, {
    user,
    offers
  });
});

module.exports = myRouter;
