import { AppDataSource } from '../config/db';
import Product from '../models/product.model';

export async function findById(id: number): Promise<Product | null> {
  const productRepo = AppDataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id },
    relations: { category: true }
  });

  return product;
}

export async function find(offset: number = 0, limit: number = 20): Promise<{ products: Product[], count: number; }> {
  const productRepo = AppDataSource.getRepository(Product);
  const [products, count] = await productRepo.findAndCount({
    select: { id: true, name: true },
    skip: offset,
    take: limit,
    order: { id: 1 }
  });

  return { products, count };
}