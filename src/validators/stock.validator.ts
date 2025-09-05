import { StockAdjustForm, StockEntryForm } from '../@types/stock';
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
}, {
  message: 'Un objet "StockEntry" est requis'
});

export const stockAdjustValidator: z.ZodType<StockAdjustForm[]> = z.array(z.object({
  productId: z.number({
    required_error: 'Le champs "productId" est requis',
    invalid_type_error: 'L\'identifiant du produit doit un nombre entier positif'
  }).positive('L\'identifiant du produit doit un nombre entier positif')
    .int('L\'identifiant du produit doit un nombre entier positif'),
  stock: z.number({
    required_error: 'Le champs "stock" est requis',
    invalid_type_error: 'La valeur du stock doit un nombre entier positif'
  }).positive('La valeur du stock doit un nombre entier positif')
    .int('La valeur du stock doit un nombre entier positif')
}), {
  message: 'Un tableau d\'objet "StockAdjust" est requis avec une entrée'
}).min(1, 'Un tableau d\'objet "StockAdjust" est requis avec une entrée');