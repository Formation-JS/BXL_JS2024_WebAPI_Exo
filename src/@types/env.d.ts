declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Common
      NODE_ENV: string;
      PORT: string;
      // Database
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      // Json Web Token
      JWT_SECRET: string;
      JWT_ISSUER: string;
      JWT_AUDIENCE: string;
      // Multer
      UPLOAD_TEMP: string;
      UPLOAD_DIRECTORY: string;
  }
}
}

export default global;