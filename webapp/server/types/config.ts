export interface AppConfig {
	port: number;
	db: {
		client: string;
		connection: string;
	};
}
