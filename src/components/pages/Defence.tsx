import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchGetActionsDefencer, fetchGetWepones, fetchIntersepted } from '../../redux/slices/userSlice';

export default function Defence() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [defendedActions, setDefendedActions] = useState([]);

  useEffect(() => {
    console.log("Updated user in component", user);
  }, [user]);
  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    
    if (!user?.organization.startsWith('IDF')) {
      navigate('/attack');
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(fetchGetWepones());
        await dispatch(fetchGetActionsDefencer(user.area));
      } catch (error) {
        console.error("Failed to fetch weapons:", error);
      }
    };

    fetchData();
  }, [dispatch, user?._id, user?.organization, navigate]);

  const checkInterception = (actionName: string) => {
    if(!user?.wepone)
    {
      console.log("vghh");
      
      return
    }
    const possibleDefenses = user?.wepone.filter(wepone => wepone?.amount > 0 && wepone?.wepone === actionName);
    return possibleDefenses.length > 0;
  };

  // פונקציה של יירוט, תוכל להוסיף פונקציה שתקרא ל-API אם נדרש
  // const interceptAction = (actionName: string) => {
  //   console.log(`Intercepting action: ${actionName}`);
  //   // כאן יכול להיכנס הקוד לביצוע היירוט לפי הנתונים שלך (לדוג' הוזרת לפונקציה API או state)
  //   setDefendedActions(prev => [...prev, actionName]);
  // };

  return (
    <div>
      <h2>Defence Actions</h2>
      
      {/* טבלת האיומים */}
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Status</th>
            <th>Intercept</th>
          </tr>
        </thead>
        <tbody>
          {user?.actions && user?.actions.map((action, index) => (
            <tr key={index}>
              <td>{action.action}</td>
              <td>{action.isIntersptedable ? 'Interceptable' : 'Not Interceptable'}</td>
              <td>
                {action.isIntersptedable && (
                  <button onClick={()=>dispatch(fetchIntersepted({
                    attackID: action._id,
                    wepone: action.weponeIdForInterpeted!
                    }))}>
                    Intercept
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Weapons and Amounts</h2>
      
      {/* טבלת הנשקים */}
      <table>
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
        {user?.wepone && user.wepone.map((wepone, index) => (
  <tr key={index}>
    <td>{wepone.wepone}</td>
    <td>{wepone.amount}</td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}
