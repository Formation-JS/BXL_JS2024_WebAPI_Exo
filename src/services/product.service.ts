import { ProductForm } from '../@types/product';
import { AppDataSource } from '../config/db';
import Category from '../models/category.model';
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

export async function create(data: ProductForm) {
  const productRepo = AppDataSource.getRepository(Product);
  const categoryRepo = AppDataSource.getRepository(Category);

  const category = await categoryRepo.findOneBy({ id: data.categoryId });
  if (!category) {
    throw new Error('La catégorie n\'existe pas.');
  }

  if (!! await productRepo.findOneBy({ ean13: data.ean13 })) {
    throw new Error('Code EAN13 est déjà utilisé !');
  }

  const product = productRepo.create({
    name: data.name,
    ean13: data.ean13,
    description: data.description,
    category
  });
  await productRepo.save(product);

  return product;
}
