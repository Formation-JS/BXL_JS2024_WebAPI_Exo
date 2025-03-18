import type { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { ProductDataDTO, ProductListDTO } from '../dto/product.dto';
import { ProductForm } from '../@types/product';

const productController = {

  getById: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    const product = await productService.findById(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json(new ProductDataDTO(product));
  },

  getAll: async (req: Request, res: Response) => {
    const { offset, limit } = req.pagination!;

    const { products, count } = await productService.find(offset, limit);

    res.status(200).json({
      results: products.map(p => new ProductListDTO(p)),
      count
    });
  },

  add: async (req: Request, res: Response) => {
    const data = req.data as ProductForm;

    try {
      const productCreated = await productService.create(data);

      res.status(201)
        .location(`/api/product/${productCreated.id}`)
        .json(new ProductDataDTO(productCreated));
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  },

  modify: async (req: Request, res: Response) => {
    res.sendStatus(501);
  },

  uploadImage: async (req: Request, res: Response) => {
    res.sendStatus(501);
  }

};

export default productController;