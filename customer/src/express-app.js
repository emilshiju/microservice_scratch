import express from 'express';
import cors from 'cors';
import route from './api/index.js';
const { customer,appEvents} =route
import HandleErrors from './utils/error-handler.js';

export default async (app,channel) => {

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(new URL('./public', import.meta.url).pathname));


  app.use((req,res,next)=>{
   
    next()
  })


  // appEvents(app)

  // API routes
  customer(app,channel);


  // Error handling
  app.use(HandleErrors);
};
