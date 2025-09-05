import { Router } from 'express';
import memberRouter from './member.router';
import productRouter from './product.router';
import stockRouter from './stock.router';


const apiRouter = Router();

apiRouter.use('/member', memberRouter);
apiRouter.use('/product', productRouter);
apiRouter.use('/stock', stockRouter);

export default apiRouter;