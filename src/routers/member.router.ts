import { Router } from 'express';
import memberController from '../controllers/member.controller';


const memberRouter = Router();

memberRouter.route('/')
  .post(memberController.add)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/login')
  .post(memberController.login)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id')
  .get(memberController.getInfo)
  .put(memberController.modify)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id/lock')
  .patch(memberController.lock)
  .all((_, res) => { res.sendStatus(405); });

export default memberRouter;