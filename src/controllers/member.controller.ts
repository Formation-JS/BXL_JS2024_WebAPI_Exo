import type { Request, Response } from 'express';

const memberController = {

  add: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  getInfo: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  modify: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  lock: (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  login: (req: Request, res: Response) => {
    res.sendStatus(501);
  }

};

export default memberController;