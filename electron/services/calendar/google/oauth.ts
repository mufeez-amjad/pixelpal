import { BrowserWindow } from 'electron';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
const GoogleOAuth2 = google.auth.OAuth2;

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

	async auth() {
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
