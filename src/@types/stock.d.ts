import { StockEntryOperation } from '../models/stock-entry.model';

export type StockEntryForm = {
  productId: number;
  quantity: number;
  operation: StockEntryOperation.ADDITION | StockEntryOperation.WITHDRAWAL;
};