import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

//This component will check if the user is logged in or not
function ProtectedRoute({ user, setUser }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data) {
            setUser({ ...data });
          } else {
            navigate("/login", { replace: true });
            setUser(null);
          }
        } else {
          navigate("/login", { replace: true });
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
        navigate("/login", { replace: true });
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return !loading && user && <Outlet context={{ user }} />;
}

export default ProtectedRoute;
