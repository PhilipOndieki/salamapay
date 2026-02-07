import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/firestore.service';

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshStats = async () => {
    setLoading(true);
    const result = await getDashboardStats();
    
    if (result.success) {
      setStats(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refreshStats };
};