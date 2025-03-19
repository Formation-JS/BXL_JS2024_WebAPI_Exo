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
    const productId = parseInt(req.params.id);
    const data = req.data as ProductForm;

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    try {
      const isUpdated = await productService.update(productId, data);
      res.sendStatus(isUpdated ? 204 : 404);
    }
    catch (error: any) {
      res.status(400).json({ error: error?.message ?? error });
    }
  },

  getImage: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    const image = await productService.getImage(productId);
    if (!image) {
      res.sendStatus(404);
      return;
    }

    res.download(image);
  },

  uploadImage: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      res.status(400).json({ error: 'The "image" field is required' });
      return;
    }

    const { filename } = req.file;

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Bad id parameter' });
      return;
    }

    const product = await productService.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const imageSaved = await productService.saveImage(productId, filename);
    if (!imageSaved) {
      res.status(400).json({ error: 'Error on save image' });
      return;
    }

    res.location(`/api/product/${productId}/image`).sendStatus(201);
  }

};

export default productController;