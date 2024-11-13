import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (user?._id) {
      navigate("/votes");
    }
  }, []);
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:2222/api/users/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password ,organization,area}),
      });
      const data = await res.json();
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div>
      {" "}
      <input type="text" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select onChange={(e) => setOrganization(e.target.value)}>
        <option value="IDF">IDF</option>
        <option value="Hezbollah">Hezbollah</option>
        <option value="Hamas">Hamas</option>
        <option value="IRGC">IRGC</option>
        <option value="Houthis">Houthis</option>
      </select>
      <button onClick={handleRegister}>Login</button>
      {organization === "IDF" && (
        <div className="area_select">
      <select onChange={(e) => setArea(e.target.value)}>
          <option value="center">מרכז</option>
            <option value="North">צפון</option>
            <option value="South">דרום</option>
            <option value="West_Bank">יהודה ושומרון</option>
          </select>
        </div>
      )}
    </div>
  );
}
