import Product from '../models/product.model';

export type ProductForm = Omit<Product, 'id'|'category'> & {
  categoryId: number
}
