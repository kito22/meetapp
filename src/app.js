import 'dotenv/config';
import express from 'express';
import { resolve } from 'path';
import 'express-async-errors';
import Youch from 'youch';
import routes from './routes';

import './database/index';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const error = await new Youch(err, req).toJSON();
        return res.json(error);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
