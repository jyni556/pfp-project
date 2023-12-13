import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto">
      <Header account={account} setAccount={setAccount} />
      <Outlet />
    </div>
  );
};

export default Layout;
