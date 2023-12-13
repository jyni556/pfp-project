import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import MintModal from "../components/MintModal";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mintNftContract } = useOutletContext<OutletContext>();

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return (
    <>
      <div className="bg-green-100 grow">
        <div className="bg-purple-100 text-right p-2">
          <button
            className="hover:text-gray-500"
            onClick={() => setIsOpen(true)}
          >
            Mint
          </button>
        </div>
      </div>
      {isOpen && <MintModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default My;
