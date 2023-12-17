import { FC, FormEvent, useEffect, useState } from "react";
import NftCard, { NftCardProps } from "./NftCard";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../types";
import { MINT_NFT_CONTRACT } from "../abis/contractAddress";

interface MyNftCardProps extends NftCardProps {
  saleStatus: boolean;
}

const MyNftCard: FC<MyNftCardProps> = ({
  tokenId,
  image,
  name,
  saleStatus,
}) => {
  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>();

  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      const response = await saleNftContract.methods
        .setForSaleNFT(
          // @ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      console.log(response);
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
      {registedPrice ? (
        <div>{registedPrice} ETH</div>
      ) : (
        saleStatus && (
          <form onSubmit={onSubmitForSale}>
            <input
              type="text"
              className="border-2 mr-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input type="submit" value="등 록" />
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;
