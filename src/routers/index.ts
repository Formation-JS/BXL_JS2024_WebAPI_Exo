import { Router } from 'express';
import memberRouter from './member.router';
import productRouter from './product.router';


const apiRouter = Router();

apiRouter.use('/member', memberRouter);
apiRouter.use('/product', productRouter);

export default apiRouter;