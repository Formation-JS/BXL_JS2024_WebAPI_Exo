import { TokenData } from '../utils/jwt.utils';

declare global {
  namespace Express {

    export interface Request {
      token: TokenData | null;
    }

  }
}