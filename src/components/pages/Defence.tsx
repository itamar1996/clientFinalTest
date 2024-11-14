import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchGetActionsDefencer, fetchGetWepones, fetchIntersepted } from '../../redux/slices/userSlice';
import { Socket } from 'socket.io-client';
import { socket } from '../../main';

export default function Defence() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [defendedActions, setDefendedActions] = useState([]);

  useEffect(() => {
    const handleNewAttack = () => {
      dispatch(fetchGetActionsDefencer(user!.area));
      dispatch(fetchGetWepones());
      console.log("newAttack");
    };

    socket.on("newAttack", handleNewAttack);
    socket.on("intersepted",()=>       dispatch(fetchGetActionsDefencer(user!.area)));

    return () => {
      socket.off("newAttack", handleNewAttack);
    };
  }, [dispatch, user?.area]);

  useEffect(() => {
    console.log("Updated user in component", user);
  }, [user]);

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
