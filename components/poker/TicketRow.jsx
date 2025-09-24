import React from 'react';
import styles from '../../styles/poker.module.css';
import VotingSection from './VotingSection';
import ResultsSection from './ResultsSection';
import ModeratorControls from './ModeratorControls';

const TicketRow = ({
  ticket,
  index,
  isCurrent,
  cardList,
  votesRevealed,
  allParticipantsVoted,
  loading,
  selectedVote,
  hasVoted,
  handleVote,
  isModerator,
  handleReveal,
  handleReset
}) => {
  return (
    <div className={`${styles.ticketRow} ${isCurrent ? styles.currentTicket : styles.pastTicket}`}>
      <div className={styles.ticketHeader}>
        <span className={styles.ticketNumber}>#{index + 1}</span>
        <span className={styles.ticketDescription}>{ticket.description}</span>
      </div>

      {isCurrent ? (
        <div className={styles.currentTicketContent}>
          {!votesRevealed ? (
            <VotingSection
              cardList={cardList}
              selectedVote={selectedVote}
              handleVote={handleVote}
              loading={loading}
              hasVoted={hasVoted}
            />
          ) : (
            <ResultsSection ticket={ticket} cardList={cardList} />
          )}

          {isModerator && (
            <ModeratorControls
              votesRevealed={votesRevealed}
              allParticipantsVoted={allParticipantsVoted}
              loading={loading}
              handleReveal={handleReveal}
              handleReset={handleReset}
            />
          )}
        </div>
      ) : (
        <div className={styles.pastTicketContent}>
          {ticket.revealed ? (
            <div className={styles.pastResults}>
              <div className={styles.pastVotesSummary}>
                {Object.entries(ticket.votes || {})
                  .sort(([a], [b]) => {
                    const aIndex = cardList.indexOf(a);
                    const bIndex = cardList.indexOf(b);
                    return aIndex - bIndex;
                  })
                  .map(([vote, count]) => (
                    <div key={vote} className={styles.pastVoteResult}>
                      <span className={styles.pastVoteValue}>{vote}</span>
                      <span className={styles.pastVoteCount}>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className={styles.pastStatus}>Not yet voted</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketRow;
