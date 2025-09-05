import Product from '../models/product.model';

export type ProductForm = Omit<Product, 'id'|'category'|'currentStock'|'stockEntries'|'image'> & {
  categoryId: number
}
