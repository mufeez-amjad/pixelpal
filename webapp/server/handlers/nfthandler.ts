import { User } from '../types/user';
import { ApiHandler } from './apihandler';

export class NFTHandler extends ApiHandler {
	// to be used by desktop app to get list of NFTs for a user
	public async getPixelpalsForPPID(params: { ppid: string }) {
		const { ppid } = params;
		const user = await this.db<User>('users').where({ ppid }).first();

		// todo: use ethers to get list of NFTs by address
		// todo: return list of NFTs as json

		// todo: figure out what return format will be
		return [{ some_important_metadata: 'some_url' }];
	}
}
