'use strict';

const express = require(`express`);
const path = require(`path`);
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res, next) => res.status(500).render(`errors/500`));


app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);


app.listen(DEFAULT_PORT);

