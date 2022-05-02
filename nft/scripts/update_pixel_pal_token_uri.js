const dotenv = require('dotenv');
const { exit } = require('process');
dotenv.config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
	console.error(
		'Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address.'
	);
	exit();
}

const NFT_ABI = [
	{
		inputs: [
			{
				internalType: 'string',
				name: 'newBaseURI',
				type: 'string'
			}
		],
		name: 'updateBaseURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_optionId',
				type: 'uint256'
			}
		],
		name: 'tokenURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string'
			}
		],
		stateMutability: 'view',
		type: 'function',
		constant: true
	}
];

const newBaseURI = 'test'

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

	const nftContract = new web3Instance.eth.Contract(
		NFT_ABI,
		NFT_CONTRACT_ADDRESS,
		{ gasLimit: '1000000' }
	);
	let result = await nftContract.methods
		.tokenURI(0)
		.call({ from: OWNER_ADDRESS });
	console.log('original ', result);

	result = await nftContract.methods
		.updateBaseURI(newBaseURI)
		.send({ from: OWNER_ADDRESS });
	console.log('updating ', result);

	result = await nftContract.methods
		.tokenURI(0)
		.call({ from: OWNER_ADDRESS });
	console.log('after update ', result);

	exit();
}

main();
