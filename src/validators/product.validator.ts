import type { ProductForm } from '../@types/product';
import z from 'zod';

export const productValidator: z.ZodType<ProductForm> = z.object({
  name: z.string({
    required_error: 'Le champs "name" est requis',
    invalid_type_error: 'Le nom d\'un produit doit être une chaîne de caractere'
  }).min(2, 'Le nom d\'un produit doit contenir minimum 2 caracteres')
    .max(50, 'Le nom d\'un produit peut contenir maximum 50 caracteres')
    .trim(),
  ean13: z.string({
    required_error: 'Le champs "ean13" est requis',
    invalid_type_error: 'Le code EAN13 doit être une chaîne de caractere'
  }).length(13, 'Le code EAN13 doit contenir 13 caracteres'),
  description: z.string({
    required_error: 'Le champs "description" est requis',
    invalid_type_error: 'La description doit être une chaîne de caractere'
  }).min(10, 'La description doit contenir minimum 10 caracteres')
    .max(1_000, 'La description peut contenir maximum 1 000 caracteres')
    .trim()
    .nullable(),
  categoryId: z.number({
    required_error: 'Le champs "categoryId" est requis',
    invalid_type_error: 'La categorie du produit doit un nombre entier positif'
  }).positive('La categorie du produit doit un nombre entier positif')
    .int('La categorie du produit doit un nombre entier positif')
}, {
  message: 'Un objet "Product" est requis'
});
