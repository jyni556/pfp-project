import { FC, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

const My: FC = () => {
  const { mintNftContract } = useOutletContext<OutletContext>();

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return <div>My</div>;
};

export default My;
