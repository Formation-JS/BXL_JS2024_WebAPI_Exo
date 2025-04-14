import { StockEntryForm } from '../@types/stock';
import z from 'zod';
import { StockEntryOperation } from '../models/stock-entry.model';

export const stockEntryValidator: z.ZodType<StockEntryForm> = z.object({
  productId: z.number({
    required_error: 'Le champs "productId" est requis',
    invalid_type_error: 'L\'identifiant du produit doit un nombre entier positif'
  }).positive('L\'identifiant du produit doit un nombre entier positif')
    .int('L\'identifiant du produit doit un nombre entier positif'),
  quantity: z.number({
    required_error: 'Le champs "quantity" est requis',
    invalid_type_error: 'La quantité doit un nombre entier positif'
  }).positive('La quantité doit un nombre entier positif')
    .int('La quantité doit un nombre entier positif'),
  operation: z.enum([
    StockEntryOperation.ADDITION,
    StockEntryOperation.WITHDRAWAL
  ], {
    errorMap: (issue) => ({
      message: issue.code === 'invalid_type' ? 'Le champs "operation" est requis' : 'Les types d\'opération supporté sont : "addition", "withdrawal"'
    })
  })
});