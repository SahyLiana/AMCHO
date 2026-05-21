import { Database, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", //To include the cookies into our request
      });
      if (response.ok) {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 font-bold text-xl text-amber-500">
        <Database className="h-6 w-6" /> AMCHO System
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm">
          Welcome, <strong className="text-slate-100">{user?.username}</strong>
        </span>
        <button
          onClick={() => logOut()}
          className="bg-red-600 text-sm flex items-center gap-2 hover:bg-red-500 cursor-pointer text-slate-100 px-4 py-2 rounded-md"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
