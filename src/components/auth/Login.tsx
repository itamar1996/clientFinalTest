import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchLogin } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user?._id) {
      if (user.organization.startsWith("IDF")) {
        console.log("IDF");
        if (window.location.pathname !== "/defnce") {
          navigate("/defnce");
        }
      } else {
        if (window.location.pathname !== "/attack") {
          navigate("/attack");
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
        navigate('/votes')
    }
  }, []);
  

  return (
    <div>
      <input
        type="text"
        placeholder="User Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => dispatch(fetchLogin({ username, password }))}>
        Login
      </button>
    </div>
  );
}
