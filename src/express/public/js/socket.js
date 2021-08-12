'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_OFFERS_ELEMENT = 8;

  const socket = io(SERVER_URL);

  const createCategoriesElement = (categories) => {
    const fragment = document.createDocumentFragment();

    categories.forEach((category) => {
      const categoryElement = document.createElement('a');
      categoryElement.href = `offers/category/${category.id}`;
      categoryElement.textContent = category.name;
      fragment.append(categoryElement);
    });

    return fragment;
  }

  const createOfferElement = (offer) => {
    const offerType = {
      OFFER: `Куплю`,
      SALE: `Продам`
    };

    const offerTemplate = document.querySelector('#card-template');
    const offerCardElement = offerTemplate.cloneNode(true).content;

    offerCardElement.querySelector('.ticket-card__img img').src = `/img/${offer.picture}`;
    offerCardElement.querySelector('.ticket-card__label').textContent = offerType[offer.type];
    offerCardElement.querySelector('.ticket-card__title a').href = `offers/${offer.id}`;
    offerCardElement.querySelector('.ticket-card__title a').textContent = offer.title;
    offerCardElement.querySelector('.ticket-card__price').textContent = offer.sum;
    offerCardElement.querySelector('.ticket-card__desc p').textContent = offer.description;

    offerCardElement.querySelector('.ticket-card__categories').append(createCategoriesElement(offer.categories));

    return offerCardElement;
  };

  const updateOffersElements = (offer) => {
    const offerNewestBlock = document.querySelector('.ticket-list__newest');
    const offerListWrapperElement = offerNewestBlock.querySelector('.tickets-list__wrapper');
    const offerListElements = offerListWrapperElement.querySelector('ul');
    const offerElements = offerListElements.querySelectorAll('li');

    if (offerElements.length === COUNT_OFFERS_ELEMENT) {
      offerElements[offerElements.length - 1].remove();
    }

    offerListElements.prepend(createOfferElement(offer));
  }

  socket.addEventListener('offer:create', (offer) => {
    updateOffersElements(offer);
  })
})();
