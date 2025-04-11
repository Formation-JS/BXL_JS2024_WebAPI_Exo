import { Router } from 'express';
import stockController from '../controllers/stock.controller';
import { authorizeMiddleware } from '../middlewares/auth.middleware';
import { MemberRole } from '../models/member.model';


const stockRouter = Router();

stockRouter.route('/')
  .get(
    authorizeMiddleware(),
    stockController.getAll)
  .post(
    authorizeMiddleware(),
    stockController.add)
  .all((_, res) => { res.sendStatus(405); });

stockRouter.route('/:id/cancel')
  .patch(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    stockController.cancel)
  .all((_, res) => { res.sendStatus(405); });

stockRouter.route('/adjust')
  .post(
    authorizeMiddleware(MemberRole.ADMIN, MemberRole.MANAGER),
    stockController.adjust)
  .all((_, res) => { res.sendStatus(405); });

export default stockRouter;