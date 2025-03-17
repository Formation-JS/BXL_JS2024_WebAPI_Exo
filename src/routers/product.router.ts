import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authorizeMiddleware } from '../middlewares/auth.middleware';
import { MemberRole } from '../models/member.model';


const productRouter = Router();

productRouter.route('/')
  .get(productController.getAll)
  .post(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    productController.add)
  .all((_, res) => { res.sendStatus(405); });

productRouter.route('/:id')
  .get(productController.getById)
  .put(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    productController.modify)
  .all((_, res) => { res.sendStatus(405); });

productRouter.route('/:id/image')
  .post(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    productController.uploadImage)
  .all((_, res) => { res.sendStatus(405); });

export default productRouter;