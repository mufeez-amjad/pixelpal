import { ethers } from 'ethers';
import { User } from '../types/user';
import { ApiError } from './apierror';
import { ApiHandler } from './apihandler';

export class AuthHandler extends ApiHandler {
	public async registerPublicKey(
		_params: any,
		body: { ppid: string; address: string; signature: string }
	) {
		const { ppid, address, signature } = body;

		// Verify signature
		const signedBy = ethers.utils.verifyMessage(ppid, signature);
		if (address !== signedBy) {
			throw new ApiError(404, 'Received invalid signature');
		}

		const existingUser = await this.db<User>('users')
			.where({ ppid })
			.first();
		if (existingUser) {
			// Eventually we may want to give users the option to update their PPID to forget the old one
			// in the event they got a new device/installation of pixelpal
			throw new ApiError(
				409,
				`PPID '${ppid}' already registered to address ${existingUser.address}`
			);
		}

		await this.db<User>('users').insert({ ppid, address });
		return 'ok!';
	}
}
