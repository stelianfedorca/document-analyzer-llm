declare namespace NodeJS {
  interface ProcessEnv {
    // Firebase Admin (server)
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_STORAGE_BUCKET: string;

    // Emulators
    FIREBASE_USE_EMULATORS?: "true" | "false";

    // Gemini
    GEMINI_API_KEY: string;
    GEMINI_MODE: "mock" | "real"; // mock vs real calls
    GEMINI_MODEL: string; // e.g. "gemini-2.5-flash"

    RATE_LIMIT_MAX_PER_HOUR?: string; // parseInt in code
    RATE_LIMIT_WINDOW_MINUTES?: string; // if you change the window

    // Firebase Client (browser)
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;

    // Node
    NODE_ENV: "development" | "production" | "test";
  }
}
