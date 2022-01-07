const dotenv = require('dotenv');
dotenv.config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
console.log(__dirname);
console.log("mnemonic: ", MNEMONIC);
console.log("alchemy: ", NODE_API_KEY);

const needsNodeAPI =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("rinkeby") ||
    process.env.npm_config_argv.includes("live"));

if ((!MNEMONIC || !NODE_API_KEY) && needsNodeAPI) {
  console.error("Please set a mnemonic and ALCHEMY_KEY or INFURA_KEY.");
  process.exit(0);
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    //polygon Infura mainnet
    polygon_infura_mainnet: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: MNEMONIC
        },
        providerOrUrl:
        "https://polygon-mainnet.g.alchemy.com/v2/" + NODE_API_KEY
        //  "https://polygon-mainnet.infura.io/v3/" + NODE_API_KEY
      }),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 137
    },
    //polygon Infura testnet
    polygon_infura_testnet: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: MNEMONIC
        },
        providerOrUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/" + NODE_API_KEY
        //  "https://polygon-mumbai.infura.io/v3/" + NODE_API_KEY
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
      networkCheckTimeout: 100000
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 2,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 20   // Optimize for how many times you intend to run the code
        },
      },
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'ETHERSCAN_API_KEY_FOR_VERIFICATION'
  }
};
