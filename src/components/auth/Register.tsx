import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { fetchLogin, fetchRegister } from "../../redux/slices/userSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    console.log("user",user);
    
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
      <button onClick={()=>dispatch(fetchRegister({username,password,organization,area}))}>Login</button>
    </div>
  );
}
