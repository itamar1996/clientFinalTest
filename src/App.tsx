import React, { useEffect } from "react";
import Nav from "./components/Nav";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useAppDispatch } from "./redux/store";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Attack from "./components/pages/Attack";
import Defence from "./components/pages/Defence";

export default function App() {
  const dispatch = useAppDispatch()

  return (
    <div>
      <Nav />
      <ToastContainer
        position="bottom-right"
        autoClose={500}
        theme="light"
        pauseOnHover
        // stacked
      />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/attack" element={<Attack />} />
        <Route path="/defnce" element={<Defence />} />

      </Routes>
    </div>
  );
}
