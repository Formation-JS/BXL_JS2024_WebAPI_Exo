import { In } from 'typeorm';
import { StockAdjustForm, StockEntryForm } from '../@types/stock';
import { AppDataSource } from '../config/db';
import Member from '../models/member.model';
import Product from '../models/product.model';
import StockEntry, { StockEntryOperation } from '../models/stock-entry.model';

export function create(data: StockEntryForm, memberId: number) {
  return AppDataSource.manager.transaction(async transactionalManager => {
    const productRepo = transactionalManager.getRepository(Product);
    const stockRepo = transactionalManager.getRepository(StockEntry);
    const memberRepo = transactionalManager.getRepository(Member);

    // Validation
    const member = await memberRepo.findOneBy({ id: memberId, isDisable: false });
    if (!member) {
      throw new Error('L\'utilisateur est invalide.');
    }

    const product = await productRepo.findOneBy({ id: data.productId });
    if (!product) {
      throw new Error('Le produit n\'existe pas.');
    }

    const productStock = getModifCurrentStock(product, data);
    if (productStock < 0) {
      throw new Error('Le stock d\'un produit ne peut pas tomber en négatif');
    }

    // Modification du stock actuelle de produit
    productRepo.update(product.id, {
      currentStock: productStock
    });

    // Ajout d'une transaction dans le stock
    const stockEntry = stockRepo.create({
      quantity: data.quantity,
      operation: data.operation,
      product,
      createBy: member
    });
    await stockRepo.save(stockEntry);

    // Récuperation de la transaction du stock à jour
    const stockEntryCreated = await stockRepo.findOne({
      where: { id: stockEntry.id },
      relations: {
        product: {
          category: true
        },
        createBy: true,
      }
    });
    if (!stockEntryCreated) {
      throw new Error('Erreur lors de la création de la transaction.');
    }

    return stockEntryCreated;
  });
}

function getModifCurrentStock(
  product: Product,
  entry: { operation: StockEntryOperation, quantity: number; },
  toCancel = false
) {
  let productStock = product.currentStock;
  const quantity = (!toCancel) ? entry.quantity : -entry.quantity;

  switch (entry.operation) {
    case StockEntryOperation.ADDITION:
      return productStock + quantity;
    case StockEntryOperation.WITHDRAWAL:
      return productStock - quantity;
    default:
      throw new Error('Opération est invalide.');
  }
}

export function cancel(stockEntryId: number) {
  return AppDataSource.manager.transaction(async transactionalManager => {
    const productRepo = transactionalManager.getRepository(Product);
    const stockRepo = transactionalManager.getRepository(StockEntry);

    // Validation
    const stockEntry = await stockRepo.findOne({
      where: { id: stockEntryId },
      relations: { product: true }
    });

    if (!stockEntry) {
      throw new Error('La transaction n\'a pas été trouvé.');
    }
    if (stockEntry.isCancel) {
      throw new Error('La transaction est déjà annulé.');
    }

    const productStock = getModifCurrentStock(stockEntry.product, stockEntry, true);

    // Mise à jour de la DB
    productRepo.update(stockEntry.product.id, {
      currentStock: productStock
    });

    stockRepo.update(stockEntryId, {
      isCancel: true
    });
  });
}

export function adjust(data: StockAdjustForm[], memberId: number) {
  return AppDataSource.manager.transaction(async transactionalManager => {
    const productRepo = transactionalManager.getRepository(Product);
    const stockRepo = transactionalManager.getRepository(StockEntry);
    const memberRepo = transactionalManager.getRepository(Member);

    const member = await memberRepo.findOneBy({ id: memberId, isDisable: false });
    if (!member) {
      throw new Error('L\'utilisateur est invalide.');
    }

    const products = await productRepo.find({
      where: { id: In(data.map(e => e.productId)) }
    });
    if (products.length === 0) {
      throw new Error('Les produits ne sont pas valide.');
    }

    type AdjustResult = { stockEntries: StockEntry[], productsUpdated: Product[]; };
    const { stockEntries, productsUpdated } = products.reduce((acc, product) => {

      const adjustData = data.find(e => e.productId == product.id);
      if (!adjustData) { return acc; }

      const productUpdate = { ...product, currentStock: adjustData.stock };
      acc.productsUpdated.push(productUpdate);

      const stockEntry = new StockEntry();
      stockEntry.operation = StockEntryOperation.ADJUSTMENT;
      stockEntry.createBy = member;
      stockEntry.product = product;
      stockEntry.quantity = adjustData.stock;
      acc.stockEntries.push(stockEntry);

      return acc;
    }, { stockEntries: [], productsUpdated: [] } as AdjustResult);

    productRepo.save(productsUpdated);
    stockRepo.save(stockEntries);
  });
}

export async function find(offset: number = 0, limit: number = 20, order: 'ASC'|'DESC'): Promise<{ stockEntries: StockEntry[], count: number; }> {
  const stockRepo = AppDataSource.getRepository(StockEntry);

  const [stockEntries, count] = await stockRepo.findAndCount({
    select: { id: true, quantity: true, operation: true, product: { name: true }, createdAt: true },
    relations: {
      product: true
    },
    skip: offset,
    take: limit,
    order: { createdAt: order }
  });

  return { stockEntries, count };
}