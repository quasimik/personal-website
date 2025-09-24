import React from 'react';
import styles from '../../styles/poker.module.css';

const ResultsSection = ({ ticket, participants, userId, votesRevealed }) => {
  return (
    <div className={styles.resultsSection}>
      <h3>Votes Cast</h3>
      <div className={styles.votesSummary}>
        {Object.entries(ticket.votes || {})
          .map(([participantId, vote]) => {
            const participant = Object.values(participants).find(p => p.id === participantId);
            const participantName = participant ? participant.name : participantId;
            const hasAcceptedEstimate = ticket.acceptedEstimate;

            return (
              <div key={participantId} className={styles.voteResultContainer}>
                <div className={`${styles.voteResult} ${hasAcceptedEstimate && votesRevealed ? styles.acceptedTicket : ''}`}>
                  <div className={`${styles.voteValue} ${!votesRevealed ? styles.blankCardValue : ''}`}>
                    {votesRevealed ? vote : '🂠'}
                  </div>
                  {hasAcceptedEstimate && votesRevealed && (
                    <div className={styles.acceptedEstimate}>
                      ✓ {ticket.acceptedEstimate}
                    </div>
                  )}
                </div>
                <div className={styles.voteParticipantName}>
                  {participantName}{participantId === userId ? ' (You)' : ''}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ResultsSection;
