'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const OfferService = require(`./offer`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  OfferService,
  UserService
};
