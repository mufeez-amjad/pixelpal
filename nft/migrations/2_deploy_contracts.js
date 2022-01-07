const dotenv = require('dotenv');
dotenv.config();

const PixelPal = artifacts.require("./PixelPal.sol");
const PixelPalFactory = artifacts.require("./PixelPalFactory.sol");

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = "";
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else if (network === 'mainnet') {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  } else if (network == 'polygon_infura_mainnet') {
    proxyRegistryAddress = '0x58807baD0B376efc12F5AD86aAc70E78ed67deaE';
  } else {  // polygon mumbai testnet
    proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';
  }

  await deployer.deploy(PixelPal, proxyRegistryAddress, {gas: 5000000});

  await deployer.deploy(PixelPalFactory, proxyRegistryAddress, PixelPal.address, {gas: 7000000});
  const pixelpal = await PixelPal.deployed();
  await pixelpal.transferOwnership(PixelPalFactory.address);
};
