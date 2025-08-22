declare namespace NodeJS {
	interface ProcessEnv {
		[key: string]: string | undefined;
		
		// Hashnode Configuration
		NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT: string;
		NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST: string;
		NEXT_PUBLIC_MODE: string;
		
		// NextAuth Configuration
		NEXTAUTH_SECRET: string;
		NEXTAUTH_URL: string;
		
		// Feature Flags (Public)
		NEXT_PUBLIC_FEATURE_SCHEDULING: string;
		NEXT_PUBLIC_FEATURE_CASE_STUDY: string;
		NEXT_PUBLIC_FEATURE_CLIENT_INTAKE: string;
		
		// OpenAI Configuration
		OPENAI_API_KEY: string;
		OPENAI_ROUTER_MODEL_SMALL: string;
		OPENAI_ROUTER_MODEL_RESPONSES: string;
		
		// GitHub Configuration
		GITHUB_REPO_OWNER: string;
		GITHUB_REPO_NAME: string;
		GITHUB_TOKEN: string;
		
		// Google Service Account Configuration
		GOOGLE_TYPE: string;
		GOOGLE_PROJECT_ID: string;
		GOOGLE_PRIVATE_KEY_ID: string;
		GOOGLE_PRIVATE_KEY: string;
		GOOGLE_CLIENT_EMAIL: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_AUTH_URI: string;
		GOOGLE_TOKEN_URI: string;
		GOOGLE_AUTH_PROVIDER_X509_CERT_URL: string;
		GOOGLE_CLIENT_X509_CERT_URL: string;
		GOOGLE_UNIVERSE_DOMAIN: string;
		GOOGLE_CALENDAR_ID: string;

		// Google OAuth (User consent) for Calendar scheduling
		GOOGLE_CLIENT_SECRET: string;
		GOOGLE_REDIRECT_URI: string;
		GOOGLE_OAUTH_REFRESH_TOKEN: string;
		GOOGLE_DELEGATED_SUBJECT?: string;
		
		// Email Configuration
		RESEND_API_KEY: string;
		SLACK_WEBHOOK_URL: string;
		
		// App Configuration
		APP_URL: string;
		DATABASE_URL: string;
		
		// Chatbot Feature Flags (Server-side)
		FEATURE_SCHEDULING: string;
		FEATURE_CASE_STUDY: string;
		FEATURE_CLIENT_INTAKE: string;
	}
}
