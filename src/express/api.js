"use strict";

const axios = require(`axios`);

const {HttpMethod} = require(`../constants`);
const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({offset, limit, comments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
  }

  getOffer(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});

  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data
    });
  }

  editOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
