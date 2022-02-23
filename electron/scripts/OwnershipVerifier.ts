import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import axios from 'axios';

const NFT_CONTRACT_ADDRESS = '0x139e576e36e1c0b443f8b3338427cf822a89057d'; // TODO hardcode this somewhere
const OWNER_ADDRESS = '0x3cc1Fc89867aee0061E151c5AE8ed3F9088348aB'; // TODO this will come from server

export function verify(): boolean {
	const inventory: any[] = getInventory();
	if (inventory.length == 0) return false; // TODO set status of this app id to unauthorized in database
	return true;
}

export function getInventory(): any[] {
	const results: any[] = [];
	const agent = new Agent({
		rejectUnauthorized: false // at time of writing, there are certificate expired issues
	});
	axios
		.get(
			'https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50', // TODO change to mainnet
			{
				params: {
					owner: OWNER_ADDRESS,
					asset_contract_address: NFT_CONTRACT_ADDRESS
				},
				httpsAgent: agent
			}
		)
		.then((res: AxiosResponse) => {
			if (res.data.assets.length == 0) {
				// doesn't own a pixel pal
				return results;
			}

			// get the metadata for each asset
			res.data.assets.forEach((asset: any) => {
				console.log(asset.token_metadata);
				axios
					.get(
						asset.token_metadata, // ipfs url to JSON metadata
						{
							httpsAgent: agent
						}
					)
					.then((metadata: any) => {
						results.push(metadata.data);
					});
			});
		})
		.catch((error: any) => {
			// if there is error, assume valid
			console.error(`Failed to verify ownership: ${error}`);
		});

	return results;
}
