import express from 'express';
import cors from 'cors';
import route from './api/index.js';
const { customer, products, shopping } =route
import HandleErrors from './utils/error-handler.js';

export default async (app) => {

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(new URL('./public', import.meta.url).pathname));

  // API routes
  customer(app);
  products(app);
  shopping(app);

  // Error handling
  app.use(HandleErrors);
};
