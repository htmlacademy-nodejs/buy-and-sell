'use strict';

const {Server} = require(`socket.io`);

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`localhost:8080`],
      methods: [`GET`]
    }
  });
};
