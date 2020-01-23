'use strict';

const chalk = require(`chalk`);

const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.info(chalk.blue(version));
  }
};
