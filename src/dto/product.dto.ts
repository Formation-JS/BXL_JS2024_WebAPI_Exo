import Product from '../models/product.model';
import { CategoryDataDTO } from './category.dto';

export class ProductDataDTO {
  id: number;
  name: string;
  ean13: string;
  description: string | null;
  category: CategoryDataDTO;

  constructor(product: Product) {
    this.id= product.id;
    this.name = product.name;
    this.ean13 = product.ean13;
    this.description = product.description;
    this.category = new CategoryDataDTO(product.category);
  }
}

export class ProductListDTO {
  id: number;
  name: string;

  constructor(product: Product) {
    this.id= product.id;
    this.name = product.name;
  }
}
