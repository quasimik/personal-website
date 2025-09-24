import React from 'react';
import styles from '../../styles/poker.module.css';

const ResultsSection = ({ ticket, cardList, participants, userId }) => {
  return (
    <div className={styles.resultsSection}>
      <h3>Results</h3>
      <div className={styles.votesSummary}>
        {Object.entries(ticket.votes || {})
          .sort(([participantIdA, voteA], [participantIdB, voteB]) => {
            const aIndex = cardList.indexOf(voteA);
            const bIndex = cardList.indexOf(voteB);
            if (aIndex !== bIndex) return aIndex - bIndex;
            // If same vote value, sort by participant name
            const participantA = Object.values(participants).find(p => p.id === participantIdA);
            const participantB = Object.values(participants).find(p => p.id === participantIdB);
            return (participantA?.name || participantIdA).localeCompare(participantB?.name || participantIdB);
          })
          .map(([participantId, vote]) => {
            const participant = Object.values(participants).find(p => p.id === participantId);
            const participantName = participant ? participant.name : participantId;
            return (
              <div key={participantId} className={styles.voteResult}>
                <div className={styles.voteParticipant}>
                  {participantName}{participantId === userId ? ' (You)' : ''}
                </div>
                <div className={styles.voteValue}>{vote}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ResultsSection;
