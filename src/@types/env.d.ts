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
    }
  }
}

export default global;