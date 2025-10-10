import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Signin = () => {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const handleCheckUserLogedin = async () => {
      const jwt_token = Cookies.get("jwt_access_token");

      if (!jwt_token) {
        setAuthState("not-authenticated");
      } else {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/users/users/",
            {
              headers: {
                Authorization: `Bearer ${jwt_token}`,
              },
            }
          );

          if (response.data[0].username) {
            setAuthState("authenticated");
          } else {
            const jwt_refresh_token = Cookies.get("jwt_refresh_token");

            if (jwt_refresh_token) {
              try {
                const new_response = await axios.post(
                  "http://127.0.0.1:8000/api/token/refresh/",
                  {
                    refresh: jwt_refresh_token,
                  }
                );

                if (new_response.data.access) {
                  Cookies.set("jwt_access_token", new_response.data.access);

                  setAuthState("authenticated");
                } else {
                  setAuthState("not-authenticated");
                }
              } catch (e) {
                setAuthState("not-authenticated");
              }
            } else {
              setAuthState("not-authenticated");
            }
          }
        } catch (e) {
          const jwt_refresh_token = Cookies.get("jwt_refresh_token");

          if (jwt_refresh_token) {
            try {
              const new_response = await axios.post(
                "http://127.0.0.1:8000/api/token/refresh/",
                {
                  refresh: jwt_refresh_token,
                }
              );

              if (new_response.data.access) {
                Cookies.set("jwt_access_token", new_response.data.access);

                setAuthState("authenticated");
              } else {
                setAuthState("not-authenticated");
              }
            } catch (e) {
              setAuthState("not-authenticated");
            }
          } else {
            setAuthState("not-authenticated");
          }
        }
      }
    };

    handleCheckUserLogedin();
  }, []);

  return (
    <>
      {authState == "loading" && <p>Loading...</p>}

      {authState == "authenticated" && <Outlet />}

      {authState == "not-authenticated" && <Navigate to="/login" />}
    </>
  );
};

export default Signin;
