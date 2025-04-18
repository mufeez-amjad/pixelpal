const dotenv = require('dotenv');
dotenv.config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_CREATURES = 1;
const DEFAULT_OPTION_ID = 0;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
	console.error(
		'Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address.'
	);
	return;
}

const FACTORY_ABI = [
	{
		constant: false,
		inputs: [
			{
				name: '_optionId',
				type: 'uint256'
			},
			{
				name: '_toAddress',
				type: 'address'
			}
		],
		name: 'mint',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	}
];

async function main() {
	const network =
		NETWORK === 'mainnet' || NETWORK === 'live' ? 'mainnet' : 'rinkeby';
	const provider = new HDWalletProvider(
		MNEMONIC,
		isInfura
			? 'https://' + network + '.infura.io/v3/' + NODE_API_KEY
			: 'https://eth-' + network + '.alchemyapi.io/v2/' + NODE_API_KEY
	);
	const web3Instance = new web3(provider);

	if (FACTORY_CONTRACT_ADDRESS) {
		const factoryContract = new web3Instance.eth.Contract(
			FACTORY_ABI,
			FACTORY_CONTRACT_ADDRESS,
			{ gasLimit: '1000000' }
		);

		// Creatures issued directly to the owner.
		for (var i = 0; i < NUM_CREATURES; i++) {
			const result = await factoryContract.methods
				.mint(DEFAULT_OPTION_ID, OWNER_ADDRESS)
				.send({ from: OWNER_ADDRESS });
			console.log(
				'Minted creature. Transaction: ' + result.transactionHash
			);
		}

		// Lootboxes issued directly to the owner.
		// for (var i = 0; i < NUM_LOOTBOXES; i++) {
		//   const result = await factoryContract.methods
		//     .mint(LOOTBOX_OPTION_ID, OWNER_ADDRESS)
		//     .send({ from: OWNER_ADDRESS });
		//   console.log("Minted lootbox. Transaction: " + result.transactionHash);
		// }
	} else {
		console.error(
			'Add FACTORY_CONTRACT_ADDRESS to the environment variables'
		);
	}
}

main();
