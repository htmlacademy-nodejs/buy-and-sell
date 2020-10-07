"use strict";

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `tz8bZE`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "id": `t1xn0L`,
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`
      },
      {
        "id": `CJw4Di`,
        "text": `А где блок питания?`
      },
      {
        "id": `VRPtPm`,
        "text": `Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ],
    "description": `Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Это настоящая находка для коллекционера!`,
    "picture": `item13.jpg`,
    "title": `Куплю антиквариат`,
    "type": `OFFER`,
    "sum": 10030
  },
  {
    "id": `_ybejg`,
    "category": [
      `Игры`
    ],
    "comments": [
      {
        "id": `-joTuR`,
        "text": `А где блок питания? С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `z2oeSG`,
        "text": `А сколько игр в комплекте?`
      },
      {
        "id": `lfA8cT`,
        "text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`
      }
    ],
    "description": `Это настоящая находка для коллекционера! Если найдёте дешевле — сброшу цену. Продаю с болью в сердце... Товар в отличном состоянии.`,
    "picture": `item06.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 6694
  },
  {
    "id": `qyxtfr`,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "id": `1QrQ5e`,
        "text": `Совсем немного... А сколько игр в комплекте? Неплохо, но дорого.`
      }
    ],
    "description": `Пользовались бережно и только по большим праздникам. Продаю с болью в сердце... Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки.`,
    "picture": `item16.jpg`,
    "title": `Продам слона`,
    "type": `SALE`,
    "sum": 87784
  },
  {
    "id": `Ac2lfd`,
    "category": [
      `Игры`
    ],
    "comments": [
      {
        "id": `KN5Alg`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `celPwg`,
        "text": `С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Продаю с болью в сердце...`,
    "picture": `item13.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 54264
  },
  {
    "id": `hoe1Wc`,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "id": `P6xbVA`,
        "text": `Оплата наличными или перевод на карту?`
      },
      {
        "id": `sMDAbY`,
        "text": `Почему в таком ужасном состоянии? Совсем немного...`
      },
      {
        "id": `xGepP1`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`
      },
      {
        "id": `84fXvE`,
        "text": `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`
      }
    ],
    "description": `Таких предложений больше нет! Даю недельную гарантию. Продаю с болью в сердце... Пользовались бережно и только по большим праздникам.`,
    "picture": `item15.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 91863
  }
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Журналы", "Игры", "Животные"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Журналы`, `Игры`, `Животные`])
      )
  );

});
