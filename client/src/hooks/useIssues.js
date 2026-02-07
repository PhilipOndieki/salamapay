import { useState, useEffect } from 'react';
import { subscribeToIssues } from '../services/firestore.service';

export const useIssues = (filters = {}) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToIssues(filters, (issuesData) => {
      setIssues(issuesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  return { issues, loading, error };
};