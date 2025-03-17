import { TokenData } from '../utils/jwt.utils';

declare global {
  namespace Express {
    export interface Request {

      // Auth Middleware
      token: TokenData | null;

      // Body validator Middleware
      data?: object;

    }
  }
}