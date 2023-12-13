import { Dispatch, FC, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "./Layout";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MintModal: FC<MintModalProps> = ({ setIsOpen }) => {
  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      const response = await mintNftContract.methods
        .mintNFT()
        .send({ from: account });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl">
        <div className="bg-pink-100 text-right mb-8">
          <button onClick={() => setIsOpen(false)}>x</button>
        </div>
        <div>NFT를 민팅하시겠습니까?</div>
        <div className="bg-blue-100 text-center mt-4">
          <button onClick={onClickMint}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default MintModal;
