import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

const destinationFolder = path.resolve(process.env.UPLOAD_TEMP);
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, destinationFolder);
  },
  filename: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, uuid() + path.extname(file.originalname));
  },
});

export function uploadFileMiddleware(fieldName: string, limitSize = 10) {

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * limitSize // Taille de fichier (limitSize) en "Mo" 
    },
  });


  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {

    // Déclanchement du middleware Multer pour traiter le fichier uploadé
    upload.single(fieldName)(req, res, () => {
      // Appel à la suite du traitement avec la "NextFunction"
      next();
    });
    
    // Cleanup du fichier uploadé si celui-ci est toujours présent.
    res.on('finish', () => {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    });
  };
}
