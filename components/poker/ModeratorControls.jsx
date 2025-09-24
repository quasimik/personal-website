import React from 'react';
import styles from '../../styles/poker.module.css';

const ModeratorControls = ({
  votesRevealed,
  allParticipantsVoted,
  loading,
  handleReveal,
  handleReset,
  handleAcceptTicket
}) => {
  if (!votesRevealed) {
    return (
      <div className={styles.moderatorControls}>
        <button
          onClick={handleReveal}
          disabled={!allParticipantsVoted || loading}
          className={styles.revealButton}
        >
          Reveal Votes
        </button>
      </div>
    );
  }

  return (
    <div className={styles.moderatorControls}>
      <button onClick={handleReset} disabled={loading} className={styles.resetButton}>
        Reset Votes
      </button>
      <button onClick={handleAcceptTicket} disabled={loading} className={styles.acceptButton}>
        Accept Estimate
      </button>
    </div>
  );
};

export default ModeratorControls;
