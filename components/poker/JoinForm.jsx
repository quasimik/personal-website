import React from 'react';
import styles from '../../styles/poker.module.css';

const JoinForm = ({ userName, setUserName, handleJoin, loading, error }) => {
  return (
    <div className={styles.joinForm}>
      <h2>Join Room</h2>
      <input
        type="text"
        placeholder="Your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !loading && handleJoin()}
        disabled={loading}
      />
      <button onClick={handleJoin} disabled={loading}>
        {loading ? 'Joining...' : 'Join Room'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default JoinForm;
