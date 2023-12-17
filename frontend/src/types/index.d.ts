import Web3, { Contract, ContractAbi } from "web3";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
  saleNftContract: Contract<ContractAbi>;
}

export interface NftMetadata {
  tokenId?: number;
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}
