import type { NextFunction, Request, Response } from 'express';
import { decodeJWT } from '../utils/jwt.utils';
import { MemberRole } from '../models/member.model';

export function authentificationMiddleware() {

  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {

    //! Valeur d'authentification dans le header (Bearer eyJhbGciOiJIUzUxMi...)
    const authData = req.headers['authorization'];

    //! Extraction du token
    const token = authData && authData.split(' ')[1];

    //! Si aucun donnée -> Utilisateur non authentifier
    if (!token) {
      req.token = null;
      next();
      return;
    }

    //! Validation du token et injection des données dans l'objet "Request"
    try {
      req.token = await decodeJWT(token);
    }
    catch (error) {
      req.token = null;
    }
    finally {
      next();
    }
  };
}

export function authorizeMiddleware(...roles: MemberRole[]) {

  return function (req: Request, res: Response, next: NextFunction): void {

    //! Récuperation du token dans l'objet "Request"
    const token = req.token;

    //! Vérification de la présence du token
    //? Si aucun donnée -> 401 Unauthorized
    if (!token) {
      res.sendStatus(401);
      return;
    }

    //! Vérification si on possede le role adapté
    //? Si ce n'est pas le cas -> 403 Forbidden
    if (roles.length > 1 && !roles.includes(token.role)) {
      res.sendStatus(403);
      return;
    }

    next();
  };
}