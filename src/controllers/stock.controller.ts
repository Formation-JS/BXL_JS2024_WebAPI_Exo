import { Request, Response } from 'express';
import * as stockService from './../services/stock.service';
import { StockAdjustForm, StockEntryForm } from '../@types/stock';
import { StockEntryDTO, StockEntryListDTO } from '../dto/stock-entry.dto';

const stockController = {

  getAll: async (req: Request, res: Response) => {
    const { offset, limit } = req.pagination!;
    const order = (req.query.order?.toString().toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

    const { stockEntries, count } = await stockService.find(offset, limit, order);

    res.status(200).json({
      results: stockEntries.map(se => new StockEntryListDTO(se)),
      count
    });
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
      await stockService.adjust(data, memberId);
      res.sendStatus(204);
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  }

};

export default stockController;