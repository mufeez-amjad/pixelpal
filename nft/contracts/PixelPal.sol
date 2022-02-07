// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title PixelPal
 * PixelPal - a contract for my non-fungible PixelPals.
 */
contract PixelPal is ERC721Tradable {
    string baseURI = "ipfs://QmUfQX5WiXRf3YiG6raVCXKH9T4zWHP7pqZNPA35ssZbwG/";
    address constant teamWalletAddress = 0x47FB0BE414D32C5c3d59935b860528Dc88bBec54; //TODO change to team wallet

    constructor(address _proxyRegistryAddress)
        ERC721Tradable("PixelPal", "PXP", _proxyRegistryAddress)
    {}

    function baseTokenURI() override public view returns (string memory) {
        return baseURI;
    }

    function updateBaseURI(string memory newBaseURI) public {
        assert(teamWalletAddress == msg.sender);
        baseURI = newBaseURI;
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmaF8XavePUjwmE15Xd8dePHCrf2YzqXtRXjfYthyrbyUo";
    }
}
