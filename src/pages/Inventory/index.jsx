import React, { useState } from 'react';
const axios = require('axios');

const NFT_CONTRACT_ADDRESS = '0x139e576e36e1c0b443f8b3338427cf822a89057d'; // This should be hardcoded somewhere
const OWNER_ADDRESS = '0x3cc1Fc89867aee0061E151c5AE8ed3F9088348aB'; // This is obtained after user links metamask wallet

function Inventory() {
	const [inventory, setInventory] = useState([]);

	const getInventory = () => {
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
					setInventory([]);
					return;
				}

				// get the metadata for each asset
				let owned = [];
				res.data.assets.forEach(asset => {
					console.log(asset.token_metadata);
					axios
						.get(
							asset.token_metadata // ipfs url to JSON metadata
						)
						.then(metadata => {
							console.log(metadata.data);
							let httpImage =
								'https://ipfs.io/ipfs/' +
								metadata.data.image.substring(7);
							owned.push({
								name: metadata.data.name,
								image: httpImage
							});
							console.log('owned: ', owned);
							setInventory(owned);
						});
				});
			})
			.catch(error => {
				console.error(error);
			});
	};

	const select = pixelpal => {
		console.log('Selected: ', pixelpal);
	};

	React.useEffect(() => getInventory(), []);

	return (
		<div>
			<h1>Inventory</h1>
			{inventory.map(pixelpal => (
				<div key={pixelpal.name}>
					<h2>{pixelpal.name}</h2>
					<img src={pixelpal.image} />
					<button onClick={() => select(pixelpal)}>SELECT</button>
				</div>
			))}
		</div>
	);
}

export default Inventory;
