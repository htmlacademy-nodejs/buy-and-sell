'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.send(`/offers/category/:id`));
offersRouter.get(`/add`, (req, res) => res.send(`/offers/add`));
offersRouter.get(`/edit/:id`, (req, res) => res.send(`/offers/edit/:id`));
offersRouter.get(`/:id`, (req, res) => res.send(`/offers/:id`));

module.exports = offersRouter;
