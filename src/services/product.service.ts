import { Not } from 'typeorm';
import { ProductForm } from '../@types/product';
import { AppDataSource } from '../config/db';
import Category from '../models/category.model';
import Product from '../models/product.model';
import path from 'path';
import fs from 'fs/promises';

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
    select: { id: true, name: true, currentStock: true },
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
    category,
    currentStock: 0
  });
  await productRepo.save(product);

  return product;
}

export async function update(id: number, data: ProductForm) {
  const productRepo = AppDataSource.getRepository(Product);
  const categoryRepo = AppDataSource.getRepository(Category);

  const category = await categoryRepo.findOneBy({ id: data.categoryId });
  if (!category) {
    throw new Error('La catégorie n\'existe pas.');
  }

  if (!! await productRepo.findOneBy({ ean13: data.ean13, id: Not(id) })) {
    throw new Error('Code EAN13 est déjà utilisé !');
  }

  const result = await productRepo.update(id, {
    name: data.name,
    ean13: data.ean13,
    description: data.description,
    category
  });

  return result.affected === 1;
}


async function obtainPathnameImage(filename: string) : Promise<string | null> {
  try {
    const pathname = path.resolve(process.env.UPLOAD_DIRECTORY, 'products', filename);
    await fs.access(pathname);
    return pathname;
  }
  catch {
    return null;
  }
}

async function moveImageIntoStorage(filename: string) : Promise<Boolean> {
  try {
    const pathUploaded = path.resolve(process.env.UPLOAD_TEMP, filename);
    const pathSaved = path.resolve(process.env.UPLOAD_DIRECTORY, 'products', filename);
    
    await fs.access(pathUploaded);
    await fs.rename(pathUploaded, pathSaved);
    return true;
  }
  catch {
    return false;
  }
}

export async function getImage(id: number): Promise<string | null> {
  const product = await findById(id);

  if (!product || !product.image) {
    return null;
  }

  return await obtainPathnameImage(product.image);
}

export async function saveImage(id: number, filename: string): Promise<boolean> {
  const productRepo = AppDataSource.getRepository(Product);

  const oldImage = await productRepo.findOne({
    select: { image: true },
    where: { id }
  })?.then(result => result?.image);

  const result = await productRepo.update(id, { image: filename });
  if(result.affected !== 1) {
    return false;
  }

  if (oldImage) {
    await removeImage(oldImage);
  }
  await moveImageIntoStorage(filename);
  return true;
}

export async function removeImage(filename: string) : Promise<void> {
  const pathname = await obtainPathnameImage(filename);
  if(pathname) {
    await fs.unlink(pathname);
  }
}
