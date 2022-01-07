// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title PixelPal
 * PixelPal - a contract for my non-fungible PixelPals.
 */
contract PixelPal is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("PixelPal", "PXP", _proxyRegistryAddress)
    {}

    function baseTokenURI() override public pure returns (string memory) {
        return "https://creatures-api.opensea.io/api/creature/";    // TODO change
    }

    function contractURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/contract/opensea-creatures";   // TODO change
    }
}
