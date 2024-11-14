import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchGetWepones } from '../../redux/slices/userSlice';

export default function Defence() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Failed to fetch weapons:", error);
      }
    };

    fetchData();
  }, [dispatch, user?._id, user?.organization, navigate]);

  return (
    <div>Defence</div>
  )
}
