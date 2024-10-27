import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black shadow-lg w-full">
      <div className="container mx-auto px-4 py-2 md:flex md:items-center md:justify-between">
        <div className="md:flex items-center">
          <div className="md:ml-4">
            <Link to="/orders">Orders</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
