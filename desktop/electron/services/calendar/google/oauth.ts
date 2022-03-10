import { BrowserWindow } from 'electron';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

import Store from 'electron-store';

import { OAuthManager, OAuthClientOpts, Credentials } from '../oauth';
import { IAccount } from '../base';

const GoogleOAuth2 = google.auth.OAuth2;
const store = new Store();

const OAUTH_TOKEN_KEY = 'oauth-token-google';

export default class GoogleOAuth extends OAuthManager {
	client: OAuth2Client;

	constructor(opts: OAuthClientOpts) {
		super(opts);
		this.client = new GoogleOAuth2(
			opts.clientId,
			opts.clientSecret,
			'urn:ietf:wg:oauth:2.0:oob'
		);
	}

	async auth(): Promise<Credentials> {
		const authorizationCode = await this.getAuthorizationCode();

		return new Promise((resolve, reject) =>
			this.client.getToken(authorizationCode, (err, tokens) => {
				if (tokens) {
					this.client.setCredentials(tokens);
					resolve(tokens);
				}
				reject(err);
			})
		);
	}

	async refreshToken(creds: Credentials): Promise<Credentials> {
		if (this.needToRefreshToken(creds)) {
			console.log('Need to refresh token!');
			const tokens = await this.client.refreshAccessToken();
			return tokens.credentials;
		}

		return creds;
	}

	async authClient(account?: IAccount): Promise<Credentials> {
		if (account?.creds) {
			this.client.setCredentials(account.creds);
			return await this.refreshToken(account.creds);
		} else {
			const creds = await this.auth();
			this.client.setCredentials(creds);
			return creds;
		}
	}

	getAuthorizationCode(): Promise<string> {
		return new Promise((resolve, reject) => {
			const url = this.client.generateAuthUrl({
				access_type: 'offline',
				scope: this.opts.scopes
			});

			const win = new BrowserWindow();
			win.loadURL(url);

			win.on('closed', () => {
				reject(new Error('User closed the window'));
			});

			win.on('page-title-updated', () => {
				setImmediate(() => {
					const title = win.getTitle();
					if (title.startsWith('Denied')) {
						reject(new Error(title.split(/[ =]/)[2]));
						win.removeAllListeners('closed');
						win.close();
					} else if (title.startsWith('Success')) {
						resolve(title.split(/[ =]/)[2]);
						win.removeAllListeners('closed');
						win.close();
					}
				});
			});
		});
	}
}
