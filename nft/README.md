Note: currently works for ethereum networks (rinkeby) but not on polygon
Similar issue: https://github.com/ProjectOpenSea/opensea-creatures/issues/149

## Compile

yarn truffle compile

## Deploy

yarn truffle deploy --network <network> --reset (if already deployed)

## Start Local Network

ganache-cli -l 8000000

## Test mint

node scripts/mint.js