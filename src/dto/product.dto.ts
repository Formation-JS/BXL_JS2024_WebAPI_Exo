import Product from '../models/product.model';
import { CategoryDataDTO } from './category.dto';

export class ProductDataDTO {
  id: number;
  name: string;
  ean13: string;
  description: string | null;
  category: CategoryDataDTO;
  stock: number;

  constructor(product: Product) {
    this.id= product.id;
    this.name = product.name;
    this.ean13 = product.ean13;
    this.description = product.description;
    this.category = new CategoryDataDTO(product.category);
    this.stock = product.currentStock;
  }
}

export class ProductListDTO {
  id: number;
  name: string;
  stock: number;

  constructor(product: Product) {
    this.id= product.id;
    this.name = product.name;
    this.stock = product.currentStock;
  }
}
