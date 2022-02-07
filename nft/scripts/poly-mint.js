const dotenv = require('dotenv');
dotenv.config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = require("web3");
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_CREATURES = 1;
DEFAULT_OPTION_ID = 0;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const FACTORY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_optionId",
        type: "uint256",
      },
      {
        name: "_toAddress",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
    ],
    name: "numOptions",
    outputs: [
      {
        name: "_numOptions",
        type: "uint256",
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "msgSender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "proxy",
        type: "address"
      }
    ],
    name: "MintInfo",
    type: "event"
  },
];

async function main() {
  const network =
    NETWORK === "polygon_infura_mainnet" ? "polygon-mainnet" : "polygon-mumbai";
  const chainId = 
    NETWORK === "polygon_infura_mainnet" ? 137 : 80001;

  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: MNEMONIC
    },
    providerOrUrl:
    "wss://" + network + ".g.alchemy.com/v2/" + NODE_API_KEY
    // "wss://" + network + ".infura.io/ws/v3/" + NODE_API_KEY //TODO wss:// + /ws/v3/ or https:// + /v3/
  })
  const web3Instance = new web3(provider);

  if (FACTORY_CONTRACT_ADDRESS) {
    const factoryContract = new web3Instance.eth.Contract(
      FACTORY_ABI,
      FACTORY_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    factoryContract.once("MintInfo", (error, result) => {
      console.log("EVENT");
      if (!error) {
        console.log(result);
      } else {
        console.log("error: ", error);
      }
    });

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await factoryContract.methods
        .mint(DEFAULT_OPTION_ID, OWNER_ADDRESS)
        .send({ 
          from: OWNER_ADDRESS,
          chainId: chainId,
          value: 0,
          gasLimit: 1000000,
        });
      console.log("Minted creature. Transaction: " + result.transactionHash);
    }
  } else if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await nftContract.methods
        .mintTo(OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted creature. Transaction: " + result.transactionHash);
    }
  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS or FACTORY_CONTRACT_ADDRESS to the environment variables"
    );
  }
}

main();
