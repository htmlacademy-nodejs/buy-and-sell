'use strict';

const request = require(`supertest`);
const {app} = require(`../cli/server`);
const initAPI = require(`../api`);

const {HttpCode, API_PREFIX} = require(`../../constants`);

const routes = initAPI([{
  category: [
    `Книги`,
    `Разное`
  ],
}, {
  category: [
    `Посуда`,
    `Разное`
  ],
}]);

app.use(API_PREFIX, routes);

describe(`Categories API end-to-end tests`, () => {
  test(`When get /api/category response code should be 200`, async () => {
    const res = await request(app)
      .get(`/api/category`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`When get offer's categories response should be an array`, async () => {
    const res = await request(app)
      .get(`/api/category`);

    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`When get offer's categories response should be equal to mocked array`, async () => {
    const res = await request(app)
      .get(`/api/category`);

    expect(res.body).toEqual([
      `Книги`,
      `Разное`,
      `Посуда`
    ]);
  });
});
