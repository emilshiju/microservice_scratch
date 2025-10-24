import express from 'express';
import cors from 'cors';
import route from './api/index.js';
const { customer,appEvents} =route
import HandleErrors from './utils/error-handler.js';

export default async (app) => {

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(new URL('./public', import.meta.url).pathname));


  app.use((req,res,next)=>{
    console.log(req)
    next()
  })


  appEvents(app)

  // API routes
  customer(app);


  // Error handling
  app.use(HandleErrors);
};
