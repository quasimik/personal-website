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
  handleAcceptTicket
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
            />
          )}
        </div>
      ) : (
        <div className={styles.pastTicketContent}>
          {ticket.revealed ? (
            <div className={styles.pastResults}>
              <div className={styles.pastVotesSummary}>
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
                      <div key={participantId} className={styles.pastVoteResultContainer}>
                        <div className={`${styles.pastVoteResult} ${ticket.acceptedEstimate ? styles.acceptedTicket : ''}`}>
                          <div className={styles.pastVoteValue}>{vote}</div>
                          {ticket.acceptedEstimate && (
                            <div className={styles.pastAcceptedEstimate}>
                              ✓ {ticket.acceptedEstimate}
                            </div>
                          )}
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
            <div className={styles.pastStatus}>Not yet voted</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketRow;
