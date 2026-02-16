import { useState, useEffect } from 'react';
import client from '../api/client';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = () => {
    client.get('/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    const res = await client.post('/api/transactions', transaction);
    setTransactions(prev => [res.data, ...prev]);
    return res.data;
  };

  const removeTransaction = async (id) => {
    await client.delete(`/api/transactions/${id}`);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = async (updatedTransaction) => {
    const res = await client.put(`/api/transactions/${updatedTransaction.id}`, updatedTransaction);
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? res.data : t));
    return res.data;
  };

  return { transactions, loading, error, addTransaction, removeTransaction, updateTransaction, refreshTransactions: fetchTransactions };
};

export default useTransactions;
