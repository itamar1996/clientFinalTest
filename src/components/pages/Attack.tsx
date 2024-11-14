import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchGetActionsAtacker, fetchGetWepones, fetchLaunch } from '../../redux/slices/userSlice';
import WeaponItem from './WeponeItem';
import ActionItem from './ActionItem';

export default function Attack() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState("center");
  const [selectedWeapon, setSelectedWeapon] = useState("");

  useEffect(() => {
    console.log("Updated user in component", user);
  }, [user]);

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
      <div className="attackForm">
        <h2>שיגור התקפה חדשה</h2>
        <form onSubmit={handleLaunch}>
          <label>
            אזור:
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
              <option value="center">מרכז</option>
              <option value="north">צפון</option>
              <option value="south">דרום</option>
              <option value="west-rank">מערב</option>
            </select>
          </label>
          <label>
            סוג השיגור:
            <select 
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
          <button type="submit">בצע שיגור</button>
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
