import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";
import { log } from "console";

interface SaleNftCardProps extends NftCardProps {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard: FC<SaleNftCardProps> = ({
  tokenId,
  image,
  name,
  metadataArray,
  setMetadataArray,
}) => {
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const { saleNftContract, account, web3, mintNftContract } =
    useOutletContext<OutletContext>();

  const onClickPurchase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        // @ts-expect-error
        .ownerOf(tokenId)
        .call();

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

      await saleNftContract.methods
        // @ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registedPrice, "ether"),
        });

      const temp = metadataArray.filter((v) => {
        if (v.tokenId !== tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  const getRegistedPrice = async () => {
    try {
      // @ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div>
      <NftCard tokenId={tokenId} image={image} name={name} />
      <div>
        {registedPrice} ETH <button onClick={onClickPurchase}>구매</button>
      </div>
    </div>
  );
};

export default SaleNftCard;
