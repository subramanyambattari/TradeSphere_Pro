import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white px-8 py-4 flex justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-indigo-400">
        TradeSphere
      </Link>

      {user && (
        <div className="flex gap-6 items-center">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/user">User Panel</Link>
          {user.role === "admin" && <Link to="/admin">Admin</Link>}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
