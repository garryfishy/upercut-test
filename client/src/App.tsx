import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import { Login } from "./pages/LoginPage/Login";
import { Register } from "./pages/RegisterPage/Register";
import { Home } from "./pages/Home/home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
