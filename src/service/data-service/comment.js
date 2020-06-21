'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(offer, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    offer.comments.push(newComment);
    return newComment;
  }

  drop(offer, commentId) {
    const dropComment = offer.comments
      .find((item) => item.id === commentId);

    if (!dropComment) {
      return null;
    }

    offer.comments = offer.comments
      .filter((item) => item.id !== commentId);

    return dropComment;
  }

  findAll(offer) {
    return offer.comments;
  }

}

module.exports = CommentService;
