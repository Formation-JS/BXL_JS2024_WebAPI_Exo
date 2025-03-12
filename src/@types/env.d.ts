declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Common
      NODE_ENV: string;
      PORT: string;
    }
  }
}

export default global;