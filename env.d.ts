declare namespace NodeJS {
  interface ProcessEnv {
    KV_URL: string;
    KV_REST_API_URL: string;
    KV_REST_API_TOKEN: string;
    KV_REST_API_READ_ONLY_TOKEN: string;
  }
} 