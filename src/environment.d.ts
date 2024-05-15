declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_EMAIL_ADDRESS: string
      ANALYZE: string
      APIM_BASE: string
      APIM_BASE_WSS: string
      APIM_KEY: string
      APPLICATIONINSIGHTS_CONNECTION_STRING: string
      AZURE_AD_AUTHORIZATION_ENDPOINT: string
      AZURE_AD_CLIENT_ID: string
      AZURE_AD_CLIENT_SECRET: string
      AZURE_AD_OPENID_CONFIGURATION: string
      AZURE_AD_TENANT_ID: string
      AZURE_AD_TOKEN_ENDPOINT: string
      AZURE_AD_USERINFO_ENDPOINT: string
      AZURE_COSMOSDB_CHAT_CONTAINER_NAME: string
      AZURE_COSMOSDB_DB_NAME: string
      AZURE_COSMOSDB_ENDPOINT: string
      AZURE_COSMOSDB_KEY: string
      AZURE_COSMOSDB_TENANT_CONTAINER_NAME: string
      AZURE_COSMOSDB_USER_CONTAINER_NAME: string
      AZURE_OPENAI_API_DEPLOYMENT_NAME: string
      AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME: string
      AZURE_OPENAI_API_INSTANCE_NAME: string
      AZURE_OPENAI_API_VERSION: string
      AZURE_SEARCH_API_VERSION: string
      AZURE_SEARCH_INDEX_NAME: string
      AZURE_SEARCH_NAME: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING: string
      NEXT_PUBLIC_FEATURE_TRANSCRIBE_TENANTS: string
      NEXT_PUBLIC_GTAG: string
      NEXT_PUBLIC_SYSTEM_PROMPT: string
      NEXT_TELEMETRY_DISABLED: string
      REGION_NAME: string
    }
  }
}
export {}
