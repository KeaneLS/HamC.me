import React from 'react';

const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

const SwearList = ({ swearData = [] }) => {
    if (!Array.isArray(swearData)) {
      return <p>Invalid data format.</p>;
    }
  
    return (
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        {swearData.length === 0 ? (
          <p>No swear logs available.</p>
        ) : (
          swearData.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>Date:</strong> {new Date(item.log_date).toLocaleString()}
              </p>
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>User:</strong> {item.user_name}
              </p>
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>Swear:</strong>{' '}
                {isValidUrl(item.swear_link) ? (
                  <a
                    href={item.swear_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1e90ff', textDecoration: 'none' }}
                    aria-label={`Listen to the context of the swear word: ${item.swear_name}`}
                  >
                    {item.swear_name}
                  </a>
                ) : (
                  <span style={{ color: 'red' }}>Invalid Link</span>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    );
  };

export default SwearList;