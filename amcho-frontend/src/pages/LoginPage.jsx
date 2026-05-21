import { Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUser }) {
  //User initialization
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loadingButton, setLoadingButton] = useState(false);
  // const [loadingPage, setLoadingPage] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingButton(true);

    try {
      //API Call
      const responses = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        credentials: "include", // Needed for HttpOnly Cookies
      });

      const dataUser = await responses.json();
      if (!responses.ok) {
        console.log(dataUser.error);
        setError(dataUser.error);
      } else {
        console.log(dataUser.user);
        setUser({ ...dataUser.user });
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    } finally {
      //Initializing the form and loading button
      setCredentials({ username: "", password: "" });

      setLoadingButton(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300/50 ">
      <div className="max-w-md w-full bg-white shadow-2xl p-8  rounded-xl ">
        <h2 className="text-4xl font-extrabold text-center text-amber-800 mb-2">
          AMCHO Analysis
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          Sign in to access your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-amber-800 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2 h-5 w-5 text-slate-600" />
              <input
                required
                type="text"
                id="username"
                value={credentials.username}
                onChange={handleChange}
                name="username"
                className="w-full border-[1px] border-slate-200  rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                placeholder="Enter your username"
              />
            </div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-amber-800 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2 h-5 w-5 text-slate-600" />
              <input
                required
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                name="password"
                className="w-full border-[1px] border-slate-200   rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingButton}
            className="w-full bg-amber-800 text-white cursor-pointer hover:bg-amber-700 duration-200 transition-all py-2 rounded-md"
          >
            {loadingButton ? "Loading, please wait..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
