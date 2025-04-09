import type { NextFunction, Request, Response } from "express";

export function paginationMiddleware({
  defaultLimit = 20,
  maxLimit = 50
} = {}) {

  return function (req: Request, res: Response, next: NextFunction) {

    //! Erreur si plusieurs arguments "offset" ou "limit"
    if (Array.isArray(req.query.offset) || Array.isArray(req.query.limit)) {
      res.status(400).json({ error: 'Les valeurs "offset" et "limit" doivent être unique' });
      return;
    }

    //! Extraction des valeurs dans la requete
    const offsetRequest: string = req.query.offset?.toString() || '0';
    const limitRequest: string = req.query.limit?.toString() || defaultLimit.toString();

    //! Conversion et validation des valeurs
    const offset = parseInt(offsetRequest);
    const limit = Math.min(parseInt(limitRequest), maxLimit);

    //! Erreur si une des valeurs est négative
    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0) {
      res.status(400).json({ error: 'Les valeurs "offset" et "limit" doivent être positive' });
      return;
    }

    //! Injection de données de pagination dans l'objet "Request"
    req.pagination = { offset, limit };

    next();
  };
}
