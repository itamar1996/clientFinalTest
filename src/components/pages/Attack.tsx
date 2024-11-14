import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchGetActionsAtacker, fetchGetWepones, fetchLaunch } from '../../redux/slices/userSlice';
import WeaponItem from './WeponeItem';
import ActionItem from './ActionItem';
import { socket } from '../../main';

export default function Attack() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState("center");
  const [selectedWeapon, setSelectedWeapon] = useState("");


  useEffect(() => {
    const handleNewAttack = () => {
      dispatch(fetchGetActionsAtacker());
      dispatch(fetchGetWepones());
      console.log("intersepted");
    };

    socket.on("intersepted", handleNewAttack);

    return () => {
      socket.off("newAttack", handleNewAttack);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return; 
    }
    
    if (user?.organization.startsWith('IDF')) {
      navigate('/defence');
      return; 
    }

    const fetchData = async () => {
      try {
        await dispatch(fetchGetWepones());
        await dispatch(fetchGetActionsAtacker())
      } catch (error) {
        console.error("Failed to fetch weapons:", error);
      }
    };

    fetchData();
  }, [dispatch, user?._id, user?.organization, navigate]);

  const handleLaunch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWeapon) {
      alert("בחר נשק לפני השיגור.");
      return;
    }
    
    try {
      await dispatch(fetchLaunch({ wepone: selectedWeapon, area: selectedArea }));
      console.log("שיגור הושלם");
    } catch (error) {
      console.error("Failed to launch:", error);
    }
  };

  return ( 
    <div>
      <div>
        <h2>שיגור התקפה חדשה</h2>
        <form className="attackForm" onSubmit={handleLaunch}>
          <label >
            אזור:
            <br />
            <select className='form-item' value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
              <option value="Center">מרכז</option>
              <option value="North">צפון</option>
              <option value="South">דרום</option>
              <option value="West Bank">מערב</option>
            </select>
          </label>
          <label>
            <p>סוג שיגור</p>
            <select  
            className='form-item'
              value={selectedWeapon} 
              onChange={(e) => setSelectedWeapon(e.target.value)}
            >
              <option value="" disabled>בחר נשק</option>
              {user?.wepone?.filter(weapon => weapon.amount > 0).map((weapon, index) => (
                <option key={index} value={weapon.wepone}>
                  {weapon.wepone} (כמות: {weapon.amount})
                </option>
              ))}
            </select>
          </label>
          <button className='form-item' type="submit">בצע שיגור</button>
        </form>
      </div>

     {/* טבלת נשקים */}
     <h3>נשקים זמינים</h3>
      <table>
        <thead>
          <tr>
            <th>שם נשק</th>
            <th>כמות</th>
          </tr>
        </thead>
        <tbody>
          {user?.wepone?.map((weapon, index) => (
            <WeaponItem key={index} weaponName={weapon.wepone} amount={weapon.amount} />
          ))}
        </tbody>
      </table>

      {/* טבלת פעולות */}
      <h3>פעולות בשיגור</h3>
      <table>
        <thead>
          <tr>
            <th>שם פעולה</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {user?.actions?.map((action, index) => (
            <ActionItem 
              key={index} 
              actionName={action.action} 
              actionStatus={action.status} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
