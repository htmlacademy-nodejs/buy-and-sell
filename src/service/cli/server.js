'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const initAPI = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());

module.exports = {
  app,
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const mockData = await getMockData();
    const routes = initAPI(mockData);
    app.use(API_PREFIX, routes);
    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));

    try {
      app.listen(port, (err) => {
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });

    } catch (err) {
      console.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }
  }
};
