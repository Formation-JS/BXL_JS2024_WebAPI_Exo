import { Request, Response } from 'express';
import * as stockService from './../services/stock.service';
import { StockAdjustForm, StockEntryForm } from '../@types/stock';
import { StockEntryDTO } from '../dto/stock-entry.dto';

const stockController = {

  getAll: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  add: async (req: Request, res: Response) => {
    const data = req.data as StockEntryForm;
    const memberId = req.token?.id!;

    try {
      const entryCreated = await stockService.create(data, memberId);

      res.status(201)
        .location('/api/stock')
        .json(new StockEntryDTO(entryCreated));
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  },

  cancel: async (req: Request, res: Response) => {
    const stockEntryId = parseInt(req.params.id);

    if (isNaN(stockEntryId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    try {
      await stockService.cancel(stockEntryId);
      res.sendStatus(204);
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  },

  adjust: async (req: Request, res: Response) => {
    const data = req.data as StockAdjustForm[];
    const memberId = req.token?.id!;

    try {
      await stockService.adjust(data,memberId);
      res.sendStatus(204);
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  }

};

export default stockController;