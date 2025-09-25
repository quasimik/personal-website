import React, { useState } from 'react';
import styles from '../../styles/poker.module.css';

const ParticipantsList = ({ participants, userId, currentTicket, waitingForTickets }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className={styles.participants}>
      <h3>Participants ({Object.keys(participants).length})</h3>
      <div className={styles.participantList}>
        {Object.values(participants).map(participant => {
          const hasVoted = currentTicket?.votes && currentTicket.votes[participant.id];
          return (
            <div key={participant.id} className={styles.participant}>
              <span className={styles.participantName}>
                {participant.name}{participant.id === userId ? ' (You)' : ''}
              </span>
              <span className={styles.participantStatus}>
                {waitingForTickets ? '🎉' : (hasVoted ? '✅' : '⏳')}
              </span>
            </div>
          );
        })}
        <button onClick={handleCopyLink}>
          {copied ? 'Copied!' : 'Copy room URL'}
        </button>
      </div>
    </div>
  );
};

export default ParticipantsList;
