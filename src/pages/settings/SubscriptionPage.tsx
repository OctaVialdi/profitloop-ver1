
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to profile page since subscription functionality has been removed
    navigate('/settings/profile');
  }, [navigate]);

  return null;
};

export default Subscription;
