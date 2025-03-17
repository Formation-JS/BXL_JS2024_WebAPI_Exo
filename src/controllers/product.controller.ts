import type { Request, Response } from 'express';

const productController = {

  getById: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },
  
  getAll: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },
  
  add: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },
  
  modify: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  uploadImage: async (req: Request, res: Response) => {
    res.sendStatus(501);
  }

};

export default productController;