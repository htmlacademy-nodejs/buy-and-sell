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

  getOffers({offset, limit, userId, categoryId, withComments} = {}) {
    return this._load(`/offers`, {params: {limit, offset, userId, categoryId, withComments}});
  }

  getOffer({id, userId, withComments}) {
    return this._load(`/offers/${id}`, {params: {userId, withComments}});
  }

  search({query}) {
    return this._load(`/search`, {params: {query}});
  }

  getCategory({categoryId, limit, offset}) {
    return this._load(`/category/${categoryId}`, {params: {limit, offset}});
  }

  getCategories({withCount}) {
    return this._load(`/category`, {params: {withCount}});
  }

  createOffer({data}) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data
    });
  }

  editOffer({id, data}) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment({id, data}) {
    return this._load(`/offers/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser({data}) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth({email, password}) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  removeOffer({id, userId}) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }

  removeComment({id, userId, commentId}) {
    return this._load(`/offers/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
