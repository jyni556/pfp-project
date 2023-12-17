// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import './MintNFT.sol';

contract SaleNFT {
    mapping(uint => uint) public nftPrices;

    uint[] public onSaleNFTs;

   function setForSaleNFT(address _mintNftAddress, uint _tokenId, uint _price) public {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender == nftOwner, "Caller is not NFT owner.");
        require(_price > 0, "Price is zero or lower.");
        require(nftPrices[_tokenId] == 0,"This NFT is already on sale.");
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)), "NFT owner did not approve token.");

        nftPrices[_tokenId] = _price;

        onSaleNFTs.push(_tokenId);
   }

    function purchaseNFT(address _mintNftAddress, uint _tokenId) public payable {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender != nftOwner, "Caller is NFT owner.");
        require(nftPrices[_tokenId] > 0, "This NFT not sale.");
        require(nftPrices[_tokenId] <= msg.value, "Caller sent lower than price.");

        payable(nftOwner).transfer(msg.value);

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId);

        nftPrices[_tokenId] = 0;

        checkZeroPrice();
    }

    function checkZeroPrice() public {
        for(uint i = 0; i < onSaleNFTs.length; i++) {
            if(nftPrices[onSaleNFTs[i]] == 0) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length - 1];
                onSaleNFTs.pop();
            }
        }
    }

    function getOnSaleNFTs() public view returns(uint[] memory) {
        return onSaleNFTs;
    }
}