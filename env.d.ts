declare namespace NodeJS {
  interface ProcessEnv {
    // Firebase
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_STORAGE_BUCKET: string;

    // Gemini
    GEMINI_API_KEY: string;
    GEMINI_MODE: "mock" | "real";

    // Add more as needed
    NODE_ENV: "development" | "production" | "test";
  }
}
