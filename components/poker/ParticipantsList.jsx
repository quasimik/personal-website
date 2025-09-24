import React from 'react';
import styles from '../../styles/poker.module.css';

const ParticipantsList = ({ participants, userId }) => {
  return (
    <div className={styles.participants}>
      <h3>Participants ({Object.keys(participants).length})</h3>
      <div className={styles.participantList}>
        {Object.values(participants).map(participant => (
          <div key={participant.id} className={styles.participant}>
            <span className={styles.participantName}>
              {participant.name}{participant.id === userId ? ' (You)' : ''}
            </span>
            <span className={styles.participantStatus}>👤</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
