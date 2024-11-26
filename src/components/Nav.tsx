import { NavLink, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import userSlice from "../redux/slices/userSlice";

export default function Nav() {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(userSlice.actions.logout());
    localStorage.removeItem("authorization");
    navigate('/login')
  };

  return (
    <div className="nav">
      {user.user ? (
        <>
          <NavLink to={"/votes"}>Votes</NavLink>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to={"/login"}>Login</NavLink>
          <NavLink to={"/register"}>Register</NavLink>
        </>
      )}
    </div>
  );
}
