import axios from "axios";
import ViteLogo from "/vite.svg";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {

  const [username , setUsername] = useState<string>("");
  const [password , setPassword] = useState<string>("");
  const [error , setError] = useState<string>("");

  const navigator = useNavigate();

  const handleLogin = async (e : any) => {

    e.preventDefault();

    try {

      if (username.length < 4 && password.length < 5) {
        setError("Username and password are not valid.");
        return;
      } else if (username.length < 4) {
        setError("Username is not valid.");
        return;
      } else if (password.length < 5) {
        setError("Password is not valid.");
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/api/token/" , {
        username : username,
        password: password
      } , {
        headers: {
          "Content-Type" : "application/json"
        }
      });

      if (response.data.access) {

        Cookies.set("jwt_access_token" , response.data.access);
        Cookies.set("jwt_refresh_token" , response.data.refresh);

        navigator("/dashboard");

      } else {

        setError("Username or password is not correct.");

      }

    } catch (e) {
      
      setError("Username or password is not correct.");

    }

  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src={ViteLogo}
              alt="logo"
            />
            Django React JWT
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="your username..."
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error != "" && <p className="mt-3 mb-3 text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer duration-700"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
