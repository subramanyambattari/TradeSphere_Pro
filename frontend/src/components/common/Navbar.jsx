import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">
        TradeSphere Pro
      </h1>

      <div className="space-x-6">
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
};

export default Navbar;