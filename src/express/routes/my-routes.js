'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my-tickets`));
myRouter.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
