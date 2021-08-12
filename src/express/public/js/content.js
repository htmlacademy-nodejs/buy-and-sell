'use strict';

(() => {
  const Type = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  };

  const Message = {
    '200': 'Операция успешно выполнена',
    '403': 'У вас нет доступа к этой оперции',
    '404': 'Объект не найден'
  };

  const createMessageElement = (type, content) => {
    const ElementClass = {
      SUCCESS: 'client-error__success',
      ERROR: 'client-error__fail'
    };

    const errorElement = document.createElement('div');
    errorElement.classList.add('client-error', ElementClass[type]);
    errorElement.textContent = content;
    document.body.prepend(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  };

  const onSuccess = (element) => {
    const card = element.closest('.js-card');
    card.parentNode.removeChild(card);

    createMessageElement(Type.SUCCESS, Message['200']);
  };

  const onError = (error) => {
    createMessageElement(Type.ERROR, Message[error]);
  };

  const removeObjectHandler = (evt) => {
    evt.preventDefault();

    const URL = evt.target.href;

    fetch(URL, {
      method: 'DELETE',
      credentials: 'same-origin',
    })
    .then((response) => {
      if (response.ok) {
        onSuccess(evt.target);
      }

      throw new Error(response.status);
    })
    .catch((error) => {
      onError(error.message);
    });
  };

  const removeOfferElements = document.querySelectorAll(`.ticket-card__del`);
  const removeCommentElements = document.querySelectorAll(`.comment-card__delete`);

  const removeObjectElements = [...removeOfferElements, ...removeCommentElements];

  if (removeObjectElements.length > 0) {
    Array.from(removeObjectElements).forEach((element) => {
      element.addEventListener(`click`, removeObjectHandler);
    });
  }
})();
