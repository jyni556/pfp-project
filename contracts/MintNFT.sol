// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNFT is ERC721Enumerable {
    string metadataURI;
    uint maxSupply;

    constructor(string memory _name, string memory _symbol, uint _maxSupply, string memory _metadataURI) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        metadataURI = _metadataURI;
    }

    function mintNFT() public {
        require(totalSupply() < maxSupply, "No more mint.");

        uint tokenId = totalSupply() + 1;

        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint _tokenId) public override view returns(string memory) {
        return string(abi.encodePacked(metadataURI, '/', Strings.toString(_tokenId), '.json'));
    }
}