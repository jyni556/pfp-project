import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/my">My</Link>
        <Link to="/sale">Sale</Link>
      </div>
      <div>
        <button>MetaMask Login</button>
      </div>
    </header>
  );
};

export default Header;
