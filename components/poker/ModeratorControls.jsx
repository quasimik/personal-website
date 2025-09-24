import React from 'react';
import styles from '../../styles/poker.module.css';

const ModeratorControls = ({
  votesRevealed,
  allParticipantsVoted,
  loading,
  handleReveal,
  handleReset,
  handleAcceptTicket,
  currentTicket,
  cardList,
  selectedEstimate,
  setSelectedEstimate
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

  const hasAcceptedEstimate = currentTicket?.acceptedEstimate;

  return (
    <div className={styles.moderatorControls}>
      <button onClick={handleReset} disabled={loading} className={styles.resetButton}>
        Reset Votes
      </button>

      {!hasAcceptedEstimate && (
        <div className={styles.estimateSelector}>
          <label htmlFor="estimateSelect">Accept Estimate:</label>
          <select
            id="estimateSelect"
            value={selectedEstimate}
            onChange={(e) => setSelectedEstimate(e.target.value)}
            className={styles.estimateSelect}
          >
            <option value="">Choose estimate...</option>
            {cardList.map(estimate => (
              <option key={estimate} value={estimate}>{estimate}</option>
            ))}
          </select>
          <button
            onClick={handleAcceptTicket}
            disabled={loading || !selectedEstimate}
            className={styles.acceptButton}
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeratorControls;
