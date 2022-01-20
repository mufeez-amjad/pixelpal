import { BrowserWindow } from 'electron';
import { isFuture, addSeconds } from 'date-fns';
import Store from 'electron-store';
import { addQueryParams } from '../../../util';
import { URL, URLSearchParams } from 'url';
import axios from 'axios';
import qs from 'qs';
import 'isomorphic-fetch';

import { OAuthManager, OAuthClientOpts, Credentials } from '../oauth';
import { IAccount } from '../base';

const OAUTH_TOKEN_KEY = 'oauth-token-microsoft';
const REDIRECT_URI =
	'https://login.microsoftonline.com/common/oauth2/nativeclient';

interface CredentialsResponse {
	access_token?: string;
	expires_in?: number;
	scope?: string;
	refresh_token?: string;
	id_token?: string;

	error?: string;
	error_description?: string;
}

export default class MicrosoftOAuth extends OAuthManager {
	constructor(opts: OAuthClientOpts) {
		super(opts);
	}

	async getCreds(account?: IAccount): Promise<Credentials> {
		if (account?.creds) {
			if (!this.needToRefreshToken(account.creds)) {
				return account.creds;
			} else {
				const newCreds = await this.refreshToken(account.creds);
				if (newCreds) {
					return newCreds;
				} else {
					throw Error('Failed refreshing!');
				}
			}
		}

		return await this.auth();
	}

	async auth(): Promise<Credentials> {
		const authorizationCode = await this.getAuthorizationCode();

		const body = {
			client_id: this.opts.clientId,
			scope: this.opts.scopes.join(' '),
			redirect_uri: REDIRECT_URI,
			grant_type: 'authorization_code',
			code: authorizationCode
		};
		const res = await axios.post(
			'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			qs.stringify(body)
		);

		const data: CredentialsResponse = res.data;

		if (data.error) {
			throw Error(data.error_description);
		}

		const { access_token, expires_in, refresh_token } = data;

		const creds: Credentials = {
			access_token,
			refresh_token,
			expiry_date: expires_in
				? addSeconds(new Date(), expires_in).getTime()
				: null
		};

		return creds;
	}

	async refreshToken(creds: Credentials): Promise<Credentials | undefined> {
		const body = {
			client_id: this.opts.clientId,
			scope: this.opts.scopes.join(' '),
			grant_type: 'refresh_token',
			redirect_uri: REDIRECT_URI,
			refresh_token: creds.refresh_token
			// client_secret: this.opts.clientSecret,
		};

		try {
			const res = await axios.post(
				'https://login.microsoftonline.com/common/oauth2/v2.0/token',
				qs.stringify(body)
			);

			const data: CredentialsResponse = res.data;

			if (data.error) {
				throw Error(data.error_description);
			}

			const { access_token, expires_in, refresh_token } = data;

			const newCreds: Credentials = {
				access_token,
				refresh_token,
				expiry_date: expires_in
					? addSeconds(new Date(), expires_in).getTime()
					: null
			};

			return newCreds;
		} catch (err) {
			console.error(err);
		}
	}

	getAuthorizationCode(): Promise<string> {
		return new Promise((resolve, reject) => {
			const url = addQueryParams(
				'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
				{
					client_id: this.opts.clientId,
					response_type: 'code',
					redirect_uri: REDIRECT_URI,
					response_mode: 'query',
					scope: this.opts.scopes.join(' ')
				}
			);

			const win = new BrowserWindow();
			win.loadURL(url);

			win.on('closed', () => {
				reject(new Error('User closed the window'));
			});

			win.webContents.on('did-navigate', (event, url: string) => {
				setImmediate(() => {
					const urlObj = new URL(url);
					if (urlObj.href.startsWith(REDIRECT_URI)) {
						const params = urlObj.searchParams;
						const code = params.get('code');

						if (code) {
							resolve(code);
							win.removeAllListeners('closed');
							win.close();
						} else {
							const error = params.get('error');
							const error_desc = params.get('error_description');

							if (error && error_desc) {
								reject(error + error_desc);
							} else {
								reject('OAuth failed.');
							}
							win.removeAllListeners('closed');
							win.close();
						}
					}
				});
			});
		});
	}
}
