import { AppConfig } from '../types/config';

function getConfig(env: string): AppConfig {
	switch (env) {
	case 'development':
		return {
			port: 3001,
			db: {
				client: 'postgres',
				connection: 'postgres://test:test@localhost:5432/pixelpal' // move to env var for prod
			}
		};
	case 'production':
		return {
			port: parseInt(process.env.PORT!),
			db: {
				client: 'postgres',
				connection: process.env.PG_CONNECTION_STRING!
			}
		};
	default:
		throw `Unexpected environment ${env}`;
	}
}

export const config = getConfig(process.env.NODE_ENV || 'development');
