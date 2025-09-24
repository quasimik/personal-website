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
  handleVote,
  isModerator,
  handleReveal,
  handleReset,
  participants,
  userId,
  handleAcceptTicket,
  selectedEstimate,
  setSelectedEstimate
}) => {
  return (
    <div className={`${styles.ticketRow} ${isCurrent ? styles.currentTicket : styles.pastTicket}`}>
      <div className={styles.ticketHeader}>
        <span className={styles.ticketNumber}>#{index + 1}</span>
        <span className={styles.ticketDescription}>{ticket.description}</span>
      </div>

      {isCurrent ? (
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
              votesRevealed={votesRevealed}
              allParticipantsVoted={allParticipantsVoted}
              loading={loading}
              handleReveal={handleReveal}
              handleReset={handleReset}
              handleAcceptTicket={handleAcceptTicket}
              currentTicket={ticket}
              cardList={cardList}
              selectedEstimate={selectedEstimate}
              setSelectedEstimate={setSelectedEstimate}
            />
          )}
        </div>
      ) : (
        <div className={styles.pastTicketContent}>
          {ticket.acceptedEstimate ? (
            // Show accepted estimate prominently for past tickets
            <div className={styles.pastResults}>
              <div className={styles.pastVotesSummary}>
                <div className={styles.pastAcceptedEstimateContainer}>
                  <div className={styles.pastAcceptedEstimateDisplay}>
                    <div className={styles.pastAcceptedEstimateValue}>
                      {ticket.acceptedEstimate}
                    </div>
                    <div className={styles.pastAcceptedEstimateLabel}>Accepted</div>
                  </div>
                </div>
              </div>
            </div>
          ) : ticket.revealed ? (
            // Show individual votes for past tickets without accepted estimate
            <div className={styles.pastResults}>
              <div className={styles.pastVotesSummary}>
                {Object.entries(ticket.votes || {})
                  .map(([participantId, vote]) => {
                    const participant = Object.values(participants).find(p => p.id === participantId);
                    const participantName = participant ? participant.name : participantId;
                    return (
                      <div key={participantId} className={styles.pastVoteResultContainer}>
                        <div className={styles.pastVoteResult}>
                          <div className={styles.pastVoteValue}>{vote}</div>
                        </div>
                        <div className={styles.pastVoteParticipantName}>
                          {participantName}{participantId === userId ? ' (You)' : ''}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            // Show "Not yet voted" for tickets that haven't been revealed
            <div className={styles.pastStatus}>Not yet voted</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketRow;
