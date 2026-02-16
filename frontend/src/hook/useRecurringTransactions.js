import { useState, useEffect } from 'react';
import client from '../api/client';

const useRecurringTransactions = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/api/recurring-transactions')
      .then(res => setRecurringTransactions(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const addRecurring = async (data) => {
    const res = await client.post('/api/recurring-transactions', data);
    setRecurringTransactions(prev => [res.data, ...prev]);
    return res.data;
  };

  const updateRecurring = async (updated) => {
    const res = await client.put(`/api/recurring-transactions/${updated.id}`, updated);
    setRecurringTransactions(prev => prev.map(r => r.id === updated.id ? res.data : r));
    return res.data;
  };

  const removeRecurring = async (id) => {
    await client.delete(`/api/recurring-transactions/${id}`);
    setRecurringTransactions(prev => prev.filter(r => r.id !== id));
  };

  const toggleRecurring = async (id) => {
    const res = await client.patch(`/api/recurring-transactions/${id}/toggle`);
    setRecurringTransactions(prev => prev.map(r => r.id === id ? res.data : r));
    return res.data;
  };

  return {
    recurringTransactions,
    loading,
    error,
    addRecurring,
    updateRecurring,
    removeRecurring,
    toggleRecurring,
  };
};

export default useRecurringTransactions;
