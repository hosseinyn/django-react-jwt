import { Outlet , Navigate} from 'react-router-dom';
import axios from 'axios'
import Cookies from 'js-cookie';
import { useEffect , useState } from 'react';


const NoSignin = () => {

    const [authState , setAuthState] = useState("loading");

    useEffect(() => {
        const handleCheckUserLogedin = async () => {
            const jwt_token = Cookies.get("jwt_access_token");

            if (!jwt_token) {
                setAuthState("not-authenticated")
            } else {

                try {

                    const response = await axios.get("http://127.0.0.1:8000/users/users/" , {
                        headers: {
                            "Authorization" : `Bearer ${jwt_token}`
                        }
                    })

                    if (response.data[0].username) {
                        setAuthState("authenticated")
                    } else {
                        setAuthState("not-authenticated")
                    }

                } catch (e) {
                    setAuthState("not-authenticated")
                }

            }
        }

        handleCheckUserLogedin();

    } , [])


    return (
        <>
            {authState == "loading" && <p>Loading...</p>}

            {authState == "not-authenticated" && <Outlet />}

            {authState == "authenticated" && <Navigate to="/dashboard" /> }
        </>
    );

}


export default NoSignin;