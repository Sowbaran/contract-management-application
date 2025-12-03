/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_APP_REDIRECT_URL: string;
  readonly VITE_ENVIRONMENT: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
