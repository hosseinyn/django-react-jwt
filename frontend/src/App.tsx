import { BrowserRouter , Routes , Route } from "react-router-dom";

import Login from "./pages/Login";
import NoSignin from "./components/NoSignin";
import Signin from "./components/Signin";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route element={<NoSignin />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<Signin />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;
