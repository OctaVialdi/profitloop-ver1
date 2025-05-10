
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Subscription = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show a toast message explaining that subscription functionality is redirected
    toast.info("Redirecting to profile page. Subscription functionality has been removed.", {
      duration: 5000
    });
    
    // Redirect to profile page since subscription functionality has been removed
    navigate('/settings/profile');
  }, [navigate]);

  return null;
};

export default Subscription;
