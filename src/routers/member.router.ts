import { Router } from 'express';
import memberController from '../controllers/member.controller';
import { authorizeMiddleware } from '../middlewares/auth.middleware';
import { MemberRole } from '../models/member.model';


const memberRouter = Router();

memberRouter.route('/')
  .post(authorizeMiddleware(MemberRole.ADMIN), memberController.add)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/login')
  .post(memberController.login)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id')
  .get(authorizeMiddleware(), memberController.getInfo)
  .put(authorizeMiddleware(), memberController.modify)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id/lock')
  .patch(authorizeMiddleware(MemberRole.ADMIN), memberController.lock)
  .all((_, res) => { res.sendStatus(405); });

export default memberRouter;