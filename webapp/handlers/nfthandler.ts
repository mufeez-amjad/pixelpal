import { User } from '../types/user';
import { ApiHandler } from './apihandler';
import { Agent } from 'https';
import axios from 'axios';
import { ApiError } from './apierror';

const NFT_CONTRACT_ADDRESS = '0x139e576e36e1c0b443f8b3338427cf822a89057d';

export class NFTHandler extends ApiHandler {
	// to be used by desktop app to get list of NFTs for a user
	public async getPixelpalsForPPID(params: { ppid: string }) {
		const { ppid } = params;
		const user = await this.db<User>('users').where({ ppid }).first();

		if (!user) {
			throw new ApiError(404, `Couldn't find address for PPID ${ppid}`);
		}

		console.log('got user');

		const agent = new Agent({
			rejectUnauthorized: false // at time of writing, there are certificate expired issues
		});
		
		const response = await axios.get(
			'https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50', // TODO change to mainnet
			{
				params: {
					owner: user.address,
					asset_contract_address: NFT_CONTRACT_ADDRESS
				},
				httpsAgent: agent
			}
		).catch((err) => {
			throw new ApiError(500, `couldnt reach opensea api: ${err}`)
		});

		if (response.data.assets.length === 0) return []

		try {
			console.log('before');
			const res = await axios.all(
				response.data.assets.map((asset: any) => axios.get(asset.token_metadata, { httpsAgent: agent }))
			);
			return res.map((r: any) => r.data);
		} catch (err) {
			throw new ApiError(500, `couldnt get metadata: ${err}`);
		}
	}
}
