import React from 'react';
import styles from '../../styles/poker.module.css';

const VotingSection = ({ cardList, selectedVote, handleVote, loading }) => {
  return (
    <div className={styles.votingSection}>
      <h3>Cast Your Vote</h3>
      <div className={styles.votingCards}>
        {cardList.map(vote => (
          <button
            key={vote}
            className={`${styles.voteCard} ${selectedVote === vote ? styles.selected : ''}`}
            onClick={() => handleVote(vote)}
            disabled={loading}
          >
            {vote}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotingSection;
