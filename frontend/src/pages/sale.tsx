import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import SaleNftCard from "../components/SaleNftCard";

const Sale: FC = () => {
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { saleNftContract, mintNftContract } =
    useOutletContext<OutletContext>();

  const getSaleNFTs = async () => {
    try {
      const onSaleNFTs: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < onSaleNFTs.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(onSaleNFTs[i]))
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(onSaleNFTs[i]) });
      }

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getSaleNFTs();
  }, [saleNftContract]);

  return (
    <div className="grow">
      <div className="text-center py-8">
        <h1 className="font-bold text-2xl">Sale NFTs</h1>
      </div>
      <ul className="p-8 grid grid-cols-2 gap-8">
        {metadataArray?.map((v, i) => (
          <SaleNftCard
            key={i}
            image={v.image}
            name={v.name}
            tokenId={v.tokenId!}
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sale;
