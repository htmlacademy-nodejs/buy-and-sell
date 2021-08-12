'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const csrfProtection = csrf();

const OFFERS_PER_PAGE = 8;

const getAddOfferData = () => {
  return api.getCategories({withCount: false});
};

const getEditOfferData = async ({id, userId}) => {
  const [offer, categories] = await Promise.all([
    api.getOffer({id, userId, withComments: false}),
    api.getCategories({withCount: false})
  ]);

  return [offer, categories];
};

const getViewOfferData = ({id}) => {
  return api.getOffer({id, withComments: true});
};

offersRouter.get(`/category/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [categories, {category, count, offersByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const offers = {
    category,
    current: offersByCategory
  };

  res.render(`category`, {
    fullView: true,
    categories,
    count,
    offers,
    page,
    totalPages,
    user
  });
});

offersRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;

  const categories = await getAddOfferData();

  res.render(`offers/new-ticket`, {categories, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const offerData = {
    picture: file ? file.filename : ``,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.createOffer({data: offerData});

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddOfferData();

    res.render(`offers/new-ticket`, {categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

offersRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const [offer, categories] = await getEditOfferData({id, userId: user.id});

    res.render(`offers/ticket-edit`, {id, offer, categories, user, csrfToken: req.csrfToken()});
  } catch (_errors) {
    res.redirect(`/my`);
  }
});

offersRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;

  const offerData = {
    picture: file ? file.filename : body[`old-image`],
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.editOffer({id, data: offerData});

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [offer, categories] = await getEditOfferData({id});

    res.render(`offers/ticket-edit`, {id, offer, categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

offersRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const offer = await getViewOfferData({id});

  res.render(`offers/ticket`, {offer, id, user, csrfToken: req.csrfToken()});
});

offersRouter.delete(`/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const offer = await api.removeOffer({id, userId: user.id});

    res.status(HttpCode.OK).send(offer);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

offersRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  const commentData = {
    userId: user.id,
    text: comment
  };

  try {
    await api.createComment({id, data: commentData});

    res.redirect(`/offers/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewOfferData({id});

    res.render(`offers/ticket`, {offer, id, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

offersRouter.delete(`/:id/comments/:commentId`, auth, async (req, res) => {
  const {user} = req.session;
  const {id, commentId} = req.params;

  try {
    const comment = await api.removeComment({id, userId: user.id, commentId});

    res.status(HttpCode.OK).send(comment);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

module.exports = offersRouter;
