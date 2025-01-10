import React from 'react';

const PendingRequests = () => {
  const requests = [
    { id: 1, name: 'Goutam K', skill: 'React.js' },
    { id: 2, name: 'Karan', skill: 'Node.js' },
  ];

  return (
    <div>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <p><strong>{request.name}</strong> wants to learn <strong>{request.skill}</strong>.</p>
              <button className="approve-btn">Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default PendingRequests;
