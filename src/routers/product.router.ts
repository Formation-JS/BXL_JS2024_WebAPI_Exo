import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authorizeMiddleware } from '../middlewares/auth.middleware';
import { MemberRole } from '../models/member.model';
import { paginationMiddleware } from '../middlewares/pagination.middleware';
import { bodyValidatorMiddleware } from '../middlewares/body-validator.middleware';
import { productValidator } from '../validators/product.validator';
import { uploadFileMiddleware } from '../middlewares/upload-file.middleware';

const productRouter = Router();

productRouter.route('/')
  .get(
    paginationMiddleware({ defaultLimit: 5}),
    productController.getAll)
  .post(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    bodyValidatorMiddleware(productValidator),
    productController.add)
  .all((_, res) => { res.sendStatus(405); });

productRouter.route('/:id')
  .get(productController.getById)
  .put(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    bodyValidatorMiddleware(productValidator),
    productController.modify)
  .all((_, res) => { res.sendStatus(405); });

productRouter.route('/:id/image')
  .get(productController.getImage)
  .post(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    uploadFileMiddleware('image'),
    productController.uploadImage)
  .all((_, res) => { res.sendStatus(405); });

export default productRouter;