import jwt from 'jsonwebtoken';
import { MemberRole } from '../models/member.model';

export type TokenData = {
  id: number,
  login: string,
  role: MemberRole;
};

export function generateToken({ id, login, role }: TokenData): Promise<string> {

  return new Promise((resolve, reject) => {

    //? Données du token
    const data = { id, login, role };

    //? Clef pour signer le token
    const secret = process.env.JWT_SECRET;

    //? Options du token
    const options: jwt.SignOptions = {
      algorithm: 'HS512',
      expiresIn: '3h',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    };

    //? Généreration du token
    jwt.sign(data, secret, options, (error, token) => {
      if (error || !token) {
        reject(error ?? new Error('Token not generate'));
        return;
      }

      resolve(token);
    });
  });
}

export function decodeJWT(token : string) : Promise<TokenData> {
  return new Promise((resolve, reject) => {

      //? Clef de signature du token
      const secret = process.env.JWT_SECRET;

      //? Options de validation
      const options = {
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE
      }

      //? Validation du token
      jwt.verify(token, secret, options, (error, data) => {
          if(error || !data) {
              reject(error ?? new Error('Decode token fail'));
              return;
          }

          resolve(data as TokenData);
      });
  });
}