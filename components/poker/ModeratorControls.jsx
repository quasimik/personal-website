import React, { useEffect } from 'react';
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
  setSelectedEstimate,
  votesRevealed
}) => {
  const hasAcceptedEstimate = currentTicket?.acceptedEstimate;

  // Auto-select most common vote when votes are revealed
  useEffect(() => {
    if (votesRevealed && currentTicket?.votes && !hasAcceptedEstimate) {
      const votes = Object.values(currentTicket.votes);
      if (votes.length > 0) {
        // Count frequency of each vote
        const voteCounts = votes.reduce((counts, vote) => {
          counts[vote] = (counts[vote] || 0) + 1;
          return counts;
        }, {});

        // Find the most common vote(s)
        const maxCount = Math.max(...Object.values(voteCounts));
        const mostCommonVotes = cardList.filter(card => voteCounts[card] === maxCount);

        // Select the last most common vote
        setSelectedEstimate(mostCommonVotes[mostCommonVotes.length - 1]);
      }
    }
  }, [votesRevealed, setSelectedEstimate, hasAcceptedEstimate]);

  return (
    <div className={styles.moderatorControls}>
      <div className={styles.controlGroup}>
        <button
          onClick={handleReveal}
          disabled={loading || votesRevealed}
          className={styles.revealButton}
          title={votesRevealed ? "Votes are already revealed" : "Reveal votes"}
        >
          {votesRevealed ? "Votes Revealed" : "Reveal Votes"}
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
