'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`offers/ticket-edit`));
offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
