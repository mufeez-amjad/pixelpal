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
        return "ipfs://QmUfQX5WiXRf3YiG6raVCXKH9T4zWHP7pqZNPA35ssZbwG/";
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmaF8XavePUjwmE15Xd8dePHCrf2YzqXtRXjfYthyrbyUo";
    }
}
