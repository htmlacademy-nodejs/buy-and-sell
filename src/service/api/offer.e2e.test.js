'use strict';

const request = require(`supertest`);
const {app} = require(`../cli/server`);
const initAPI = require(`../api`);

const {HttpCode, API_PREFIX} = require(`../../constants`);

const MOCK_OFFERS = [{
  id: `1`,
  description: `1`,
  comments: [{id: `1`}]
}, {
  id: `2`,
  description: `2`
}];

const routes = initAPI(MOCK_OFFERS);

app.use(API_PREFIX, routes);

describe(`Offers API end-to-end tests`, () => {
  describe(`get offers`, () => {
    test(`When get /api/offers response code should be 200`, async () => {
      const res = await request(app).get(`/api/offers`);
      expect(res.statusCode).toBe(HttpCode.OK);
    });

    test(`When get offers response should be equal to mocked array`, async () => {
      const res = await request(app).get(`/api/offers`);
      expect(res.body).toEqual(MOCK_OFFERS);
    });

    test(`When get offer by id it should be equal to mocked data`, async () => {
      const res = await request(app).get(`/api/offers/1`);
      expect(res.body).toEqual(MOCK_OFFERS[0]);
    });

    test(`for non-existing offer status code should be NOT_FOUND`, async () => {
      const res = await request(app).get(`/api/offers/0`);
      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`post offer`, () => {
    test(`When post to /api/offers response should contain id`, async () => {
      const res = await request(app).post(`/api/offers`).send({
        category: ``, description: ``, picture: ``, title: ``, type: ``, sum: ``,
      });
      expect(res.body).toHaveProperty(`id`);
    });

    test(`When post to /api/offers validator should return BAD_REQUEST`, async () => {
      const res = await request(app).post(`/api/offers`).send({});
      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`update offer`, () => {
    test(`should update offer by id`, async () => {
      const updatedMock = {
        category: [`1`], description: ``, picture: ``, title: ``, type: ``, sum: ``,
      };
      const res = await request(app).put(`/api/offers/2`).send(updatedMock);
      expect(res.body).toMatchObject(updatedMock);
    });

    test(`when update offers validator should return BAD_REQUEST`, async () => {
      const res = await request(app).put(`/api/offers/1`).send({});
      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`for non-existing offer status code should be BAD_REQUEST`, async () => {
      const res = await request(app).put(`/api/offers/0`);
      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`delete offer`, () => {
    test(`When delete offer response should contain offer`, async () => {
      const {body} = await request(app).post(`/api/offers`).send({
        category: ``, description: ``, picture: ``, title: ``, type: ``, sum: ``,
      });
      const res = await request(app).delete(`/api/offers/${body.id}`);
      expect(res.body).toHaveProperty(`id`, body.id);
    });

    test(`When delete not existing offer should return NOT_FOUND`, async () => {
      const res = await request(app).delete(`/api/offers/0`);
      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`get all comments from offer`, () => {
    test(`for existing announcement should return all comments`, async () => {
      const res = await request(app).get(`/api/offers/1/comments`);
      expect(res.body).toEqual(MOCK_OFFERS[0].comments);
    });

    test(`for non-existing announcement status code should be NOT_FOUND`, async () => {
      const res = await request(app).get(`/api/offers/0/comments`);
      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`delete comments from offer`, () => {
    test(`for existing comment delete it by id`, async () => {
      const {body: comments} = await request(app).get(`/api/offers/1/comments`);
      const res = await request(app).delete(`/api/offers/1/comments/1`);
      expect(res.body).toEqual(comments[0]);

      const {body: updatedComments} = await request(app).get(`/api/offers/1/comments`);
      expect(updatedComments.length).toBe(0);
    });

    test(`for non-existing comment status code should be NOT_FOUND`, async () => {
      const res = await request(app).delete(`/api/offers/1/comments/0`);
      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`add comment to offer`, () => {
    test(`when add comment it should return new comment id`, async () => {
      const res = await request(app).post(`/api/offers/1/comments`)
        .send({text: ``});

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toHaveProperty(`id`);
    });

    test(`comment validator should return BAD_REQUEST on error`, async () => {
      const res = await request(app)
        .post(`/api/offers/1/comments`)
        .send({});
      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
