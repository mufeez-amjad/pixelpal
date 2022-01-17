const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const { exit } = require('process');

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = '0x3cc1Fc89867aee0061E151c5AE8ed3F9088348aB';

async function main() {
	// get list of pixel pals that the address owns
	axios
		.get(
			'https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50',
			{
				params: {
					owner: OWNER_ADDRESS,
					asset_contract_address: NFT_CONTRACT_ADDRESS
				}
			}
		)
		.then(res => {
			console.log(`statusCode: ${res.status}`);
			if (res.data.assets.length == 0) {
				// doesn't own a pixel pal
				console.log('this address doesn\'t own a pixel pal');
				exit();
			}

			// get the metadata for each asset
			res.data.assets.forEach(asset => {
				console.log(asset.token_metadata);
				axios
					.get(
						asset.token_metadata // ipfs url to JSON metadata
					)
					.then(metadata => {
						console.log(metadata.data);
					});
			});
		})
		.catch(error => {
			console.error(error);
		});
}

main();
