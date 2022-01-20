import { Credentials } from './oauth';

export interface IEvent {
	name: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	calendar: CalendarProperties;
}

interface CalendarProperties {
	name: string;
	color: string;
}

export const ACCOUNTS_INFO_KEY = 'connected-accounts-info';

export interface IUser {
	email?: string | null | undefined;
}

export interface IAccount {
	user: IUser;
	creds?: Credentials;
}

interface IPlatformAccounts {
	[key: string]: IAccount;
}

export interface IAccounts {
	google?: IPlatformAccounts;
	microsoft?: IPlatformAccounts;
}

export abstract class BaseCalendar {
	accounts: Array<IAccount> = [];

	constructor(accounts: IPlatformAccounts | undefined) {
		if (!accounts) {
			return;
		}

		Object.keys(accounts).forEach(account => {
			this.accounts.push({
				user: accounts[account].user,
				creds: accounts[account].creds
			});
		});
	}

	protected abstract getAccountEventsBetweenDates(
		account: IAccount,
		start: Date,
		end: Date
	): Promise<IEvent[]>;

	async getEventsBetweenDates(start: Date, end: Date): Promise<IEvent[]> {
		let events: IEvent[] = [];

		for (const account of this.accounts) {
			console.log('Getting events for', account);
			try {
				account.creds = await this.auth(account);
			} catch (err) {
				console.error(err);
				continue;
			}

			const accountEvents = await this.getAccountEventsBetweenDates(
				account,
				start,
				end
			);
			events = events.concat(accountEvents);
		}

		return events;
	}

	abstract auth(account?: IAccount): Promise<Credentials>;
}
