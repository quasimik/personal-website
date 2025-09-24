import React from 'react';
import styles from '../../styles/poker.module.css';

const ResultsSection = ({ ticket, cardList }) => {
  return (
    <div className={styles.resultsSection}>
      <h3>Results</h3>
      <div className={styles.votesSummary}>
        {Object.entries(ticket.votes || {})
          .sort(([a], [b]) => {
            const aIndex = cardList.indexOf(a);
            const bIndex = cardList.indexOf(b);
            return aIndex - bIndex;
          })
          .map(([vote, count]) => (
            <div key={vote} className={styles.voteResult}>
              <span className={styles.voteValue}>{vote}</span>
              <span className={styles.voteCount}>
                {count} vote{count !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResultsSection;
