import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>(username);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPasword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigator = useNavigate();

  function sleep(ms : number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const handleGetUsername = async () => {
      const jwt_token = Cookies.get("jwt_access_token");

      try {
        const response = await axios.get("http://127.0.0.1:8000/users/users/", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        });

        if (response.data[0].username) {
          setUsername(response.data[0].username);
          setNewUsername(response.data[0].username);
        }
      } catch (e) {
        console.log(e);
      }
    };

    handleGetUsername();
  }, []);

  const handleLogout = async () => {
    Cookies.remove("jwt_access_token");
    Cookies.remove("jwt_refresh_token");

    await sleep(1700);

    navigator("/login")

  };

  const handleChangeAccountInformation = async (e: any) => {
    e.preventDefault();

    if (newUsername.length < 4 && password.length < 5) {
      setError("Username and password are not valid.");
      return;
    } else if (newUsername.length < 4) {
      setError("Username is not valid.");
      return;
    } else if (password.length < 5) {
      setError("Password is not valid.");
      return;
    } else if (confirmPassword.length < 5) {
      setError("Confirm password is not valid.");
      return;
    }

    if (confirmPassword != password) {
      setError("Passwords don't match.");
      return;
    }

    const jwt_token = Cookies.get("jwt_access_token");
    const decoded_jwt = jwtDecode(`${jwt_token}`);

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/users/users/${decoded_jwt.user_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      );

      if (response.data.username) {
        alert("Changed !");
        handleLogout();

      }
    } catch (e) {
      console.log(e);
    }
  };


  const handleDeleteAccount = async () => {

    const jwt_token = Cookies.get("jwt_access_token");
    const decoded_jwt = jwtDecode(`${jwt_token}`);

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/users/users/${decoded_jwt.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      );

      handleLogout();

    } catch (e) {
      console.log(e);
    }

  }


  return (
    <>
      <h1 className="text-5xl mt-10 text-center mb-10 text-white">
        Dashboard , {username}
      </h1>

      <div className="flex flex-row gap-6 justify-center items-center mb-10">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          type="button"
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          onClick={handleDeleteAccount}
        >
          Delete account
        </button>
      </div>

      <h3 className="text-xl text-white text-center mb-6">
        Change account information
      </h3>
      <form
        className="max-w-sm mx-auto"
        onSubmit={handleChangeAccountInformation}
      >
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your username
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your new username..."
            defaultValue={username}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Entet your new password..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confim new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Repeat your new password..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setConfirmPasword(e.target.value)}
            required
          />
        </div>

        {error != "" && <p className="mt-3 mb-3 text-red-600">{error}</p>}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Dashboard;
