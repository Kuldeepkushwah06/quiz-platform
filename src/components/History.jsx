import React, { useEffect, useState } from 'react';
import { getAttemptHistory } from '../services/db';

const History = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getAttemptHistory();
      setAttempts(history);
    };
    loadHistory();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Attempt History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Score</th>
              <th className="px-6 py-3 text-left">Time Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td className="px-6 py-4">
                  {new Date(attempt.date).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {attempt.score.toFixed(2)}%
                </td>
                <td className="px-6 py-4">
                  {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History; 