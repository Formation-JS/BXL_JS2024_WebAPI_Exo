import StockEntry, { StockEntryOperation } from '../models/stock-entry.model';
import { MemberInfoDTO } from './member.dto';
import { ProductDataDTO } from './product.dto';

export class StockEntryDTO {
  id: number;
  product: ProductDataDTO;
  quantity: number;
  operation: StockEntryOperation;
  createBy: MemberInfoDTO;
  createdAt: string;

  constructor(stockEntry: StockEntry) {
    this.id = stockEntry.id;
    this.product = new ProductDataDTO(stockEntry.product);
    this.quantity = stockEntry.quantity;
    this.operation = stockEntry.operation;
    this.createBy = new MemberInfoDTO(stockEntry.createBy);
    this.createdAt = stockEntry.createdAt.toISOString()
  }
}






