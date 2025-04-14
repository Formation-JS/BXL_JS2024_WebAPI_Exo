import { StockEntryForm } from '../@types/stock';
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
      throw new Error('L\'utilisation est invalide.');
    }

    const product = await productRepo.findOneBy({ id: data.productId });
    if (!product) {
      throw new Error('Le produit n\'existe pas.');
    }

    let productStock = product.currentStock;
    switch (data.operation) {
      case StockEntryOperation.ADDITION:
        productStock = productStock + data.quantity;
        break;
      case StockEntryOperation.WITHDRAWAL:
        productStock = productStock - data.quantity;
        break;
      default:
        throw new Error('Opération est invalide.');
    }
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