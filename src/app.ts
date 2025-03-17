import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { color } from './utils/color.utils';
import apiRouter from './routers';
import { AppDataSource } from './config/db';

//! Env variable
const { NODE_ENV, PORT } = process.env;

//! Database
AppDataSource.initialize()
    .then(() => {
        console.log(`Connection to DB successfull`);
    })
    .catch((error) => {
        console.log(`Connection to DB on error`);
        console.log(error);
    });

//! Create WebAPI
const app = express();

//! App middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//! Routing
app.use('/api{/v1}', apiRouter);

//! Starting
app.listen(PORT, () => {
  const { msg, warn, info } = color;
  console.log(`${msg('Web API is running on port')} ${warn(PORT)} ${info(`[${NODE_ENV}]`)}`);
});