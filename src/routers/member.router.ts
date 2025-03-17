import { Router } from 'express';
import memberController from '../controllers/member.controller';
import { authorizeMiddleware } from '../middlewares/auth.middleware';
import { MemberRole } from '../models/member.model';
import { bodyValidatorMiddleware } from '../middlewares/body-validator.middleware';
import { memberCreateValidator, memberLoginValidator, memberUpdateValidator } from '../validators/member.validator';


const memberRouter = Router();

memberRouter.route('/')
  .post(
    authorizeMiddleware(MemberRole.ADMIN),
    bodyValidatorMiddleware(memberCreateValidator),
    memberController.add)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/login')
  .post(
    bodyValidatorMiddleware(memberLoginValidator),
    memberController.login)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id')
  .get(authorizeMiddleware(), memberController.getInfo)
  .put(
    authorizeMiddleware(),
    bodyValidatorMiddleware(memberUpdateValidator),
    memberController.modify)
  .all((_, res) => { res.sendStatus(405); });

memberRouter.route('/:id/lock')
  .patch(authorizeMiddleware(MemberRole.ADMIN), memberController.lock)
  .all((_, res) => { res.sendStatus(405); });

export default memberRouter;