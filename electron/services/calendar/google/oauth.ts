import { BrowserWindow } from 'electron';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

const GoogleOAuth2 = google.auth.OAuth2;
import { Credentials } from 'google-auth-library';

import Store from 'electron-store';

const store = new Store();

const OAUTH_TOKEN_KEY = 'oauth-token';

import { isFuture } from 'date-fns';

interface OAuthClientOpts {
	clientId: string;
	clientSecret: string;
	scopes: Array<string>;
}

export default class Auth {
	opts: OAuthClientOpts;
	client: OAuth2Client;

	constructor(opts: OAuthClientOpts) {
		this.opts = opts;
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

	async authClient(): Promise<void> {
		let creds = store.get(OAUTH_TOKEN_KEY) as Credentials;

		if (creds) {
			this.client.setCredentials(creds);

			if (creds.expiry_date) {
				let expiry = new Date(creds.expiry_date);
				if (isFuture(expiry)) {
					this.client.refreshAccessToken((error, tokens) => {
						if (!error) {
							store.set(OAUTH_TOKEN_KEY, tokens);
						}
					});
				}
			}
		} else {
			const tokens = await this.auth();
			this.client.setCredentials(tokens);
			store.set(OAUTH_TOKEN_KEY, tokens);
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
