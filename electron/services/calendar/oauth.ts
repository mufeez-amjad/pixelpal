import { isPast } from 'date-fns';

export interface OAuthClientOpts {
	clientId: string;
	clientSecret?: string;
	scopes: Array<string>;
}

export interface Credentials {
	refresh_token?: string | null;
	expiry_date?: number | null;
	access_token?: string | null;
}

export abstract class OAuthManager {
	opts: OAuthClientOpts;

	constructor(opts: OAuthClientOpts) {
		this.opts = opts;
	}

	abstract getAuthorizationCode(): Promise<string>;
	abstract refreshToken(creds: Credentials): Promise<Credentials | undefined>;
	abstract auth(): Promise<Credentials>;

	needToRefreshToken(creds: Credentials): boolean {
		if (creds.expiry_date) {
			const expiry = new Date(creds.expiry_date);
			return isPast(expiry);
		}

		return false;
	}
}
