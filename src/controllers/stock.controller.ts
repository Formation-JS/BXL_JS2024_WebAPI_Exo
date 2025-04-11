import { Request, Response } from 'express';

const stockController = {

  getAll: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  add: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  cancel: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  adjust: async (req: Request, res: Response) => {
    res.sendStatus(501);
  }

};

export default stockController;