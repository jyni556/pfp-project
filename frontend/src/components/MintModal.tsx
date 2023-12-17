import { Dispatch, FC, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { NftMetadata, OutletContext } from "../types";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const MintModal: FC<MintModalProps> = ({
  setIsOpen,
  metadataArray,
  setMetadataArray,
}) => {
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      setIsLoading(true);

      await mintNftContract.methods.mintNFT().send({ from: account });

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
      setMetadataArray([response.data, ...metadataArray]);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl">
        <div className="text-right mb-8">
          <button onClick={() => setIsOpen(false)}>x</button>
        </div>
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            <div className="font-semibold mt-1">{metadata.name}</div>
            <div className="mt-1">{metadata.description}</div>
            <ul className="mt-1 flex flex-wrap gap-1">
              {metadata.attributes.map((v, i) => (
                <li key={i}>
                  <span className="font-semibold">{v.trait_type}</span>
                  <span>: {v.value}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <button
                className="hover:text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>{isLoading ? "로딩중..." : "NFT를 민팅하시겠습니까?"}</div>
            <div className="text-center mt-4">
              <button className="hover:text-gray-500" onClick={onClickMint}>
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MintModal;
