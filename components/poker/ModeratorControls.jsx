import React from 'react';
import styles from '../../styles/poker.module.css';

const ModeratorControls = ({
  loading,
  handleReveal,
  handleReset,
  handleAcceptTicket,
  handleSkipTicket,
  currentTicket,
  cardList,
  selectedEstimate,
  setSelectedEstimate
}) => {
  const hasAcceptedEstimate = currentTicket?.acceptedEstimate;

  return (
    <div className={styles.moderatorControls}>
      <div className={styles.controlGroup}>
        <button
          onClick={handleReveal}
          disabled={loading}
          className={styles.revealButton}
          title="Reveal votes (cannot be undone except by reset)"
        >
          Reveal Votes
        </button>

        <button
          onClick={handleReset}
          disabled={loading}
          className={styles.resetButton}
          title="Reset votes and hide cards"
        >
          Reset Votes
        </button>

        <button
          onClick={handleSkipTicket}
          disabled={loading}
          className={styles.skipButton}
          title="Skip this ticket without accepting"
        >
          Skip Ticket
        </button>
      </div>

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
            title="Accept this estimate and advance to next ticket"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeratorControls;
