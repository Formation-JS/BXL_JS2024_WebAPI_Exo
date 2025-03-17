import { Router } from 'express';
import memberRouter from './member.router';


const apiRouter = Router();

apiRouter.use('/member', memberRouter);

export default apiRouter;