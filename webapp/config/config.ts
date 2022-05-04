import { AppConfig } from '../types/config';

function getConfig(env: string): AppConfig {
	switch (env) {
	case 'development':
		return {
			port: 3001,
			db: {
				client: 'postgres',
				connection: 'postgres://test:test@localhost:5432/pixelpal'
			}
		};
	case 'production':
		return {
			port: parseInt(process.env.PORT!),
			db: {
				client: 'postgres',
				connection: {
					connectionString: process.env.DATABASE_URL,
					ssl: { rejectUnauthorized: false },
				}
			}
		};
	default:
		throw `Unexpected environment ${env}`;
	}
}

export const config = getConfig(process.env.NODE_ENV || 'development');
