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
  loading,
  selectedVote,
  handleVote,
  isModerator,
  handleReveal,
  handleReset,
  participants,
  userId,
  handleAcceptTicket,
  handleSkipTicket,
  selectedEstimate,
  setSelectedEstimate
}) => {
  return (
    <div className={`${styles.ticketRow} ${isCurrent ? styles.currentTicket : styles.pastTicket}`}>
      <div className={styles.ticketHeader}>
        <span className={styles.ticketNumber}>#{index + 1}</span>
        <span className={styles.ticketDescription}>{ticket.description}</span>
        {ticket.acceptedEstimate && (
          <div className={styles.acceptedTicketSummary}>
            <span className={styles.userVote}>
              You: {ticket.votes && ticket.votes[userId] ? ticket.votes[userId] : 'No vote'}
            </span>
            <span className={styles.acceptedEstimate}>
              Accepted: {ticket.acceptedEstimate}
            </span>
          </div>
        )}
      </div>

      {isCurrent && !ticket.acceptedEstimate ? (
        <div className={styles.currentTicketContent}>
          <ResultsSection ticket={ticket} participants={participants} userId={userId} votesRevealed={votesRevealed} />
          <VotingSection
            cardList={cardList}
            selectedVote={selectedVote}
            handleVote={handleVote}
            loading={loading}
          />

          {isModerator && (
            <ModeratorControls
              loading={loading}
              handleReveal={handleReveal}
              handleReset={handleReset}
              handleAcceptTicket={handleAcceptTicket}
              handleSkipTicket={handleSkipTicket}
              currentTicket={ticket}
              cardList={cardList}
              selectedEstimate={selectedEstimate}
              setSelectedEstimate={setSelectedEstimate}
            />
          )}
        </div>
      ) : (
        <div className={styles.pastTicketContent}>
          {!ticket.acceptedEstimate && (
            <div className={styles.pastStatus}>No estimate</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketRow;
