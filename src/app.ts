import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { color } from './utils/color.utils';

//! Env variable
const { NODE_ENV, PORT } = process.env;

//! Create WebAPI
const app = express();

//! App middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//! Routing
app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Example' });
});

//! Starting
app.listen(PORT, () => {
  const { msg, warn, info } = color;
  console.log(`${msg('Web API is running on port')} ${warn(PORT)} ${info(`[${NODE_ENV}]`)}`);
});