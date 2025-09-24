import React from 'react';
import styles from '../../styles/poker.module.css';
import TicketRow from './TicketRow';
import NewTicketForm from './NewTicketForm';

const TicketList = ({
  tickets,
  currentTicket,
  cardList,
  votesRevealed,
  allParticipantsVoted,
  loading,
  selectedVote,
  handleVote,
  isModerator,
  newTicketDescription,
  setNewTicketDescription,
  handleNextTicket,
  handleReveal,
  handleReset,
  participants,
  userId
}) => {
  return (
    <div className={styles.ticketsArea}>
      {tickets.map((ticket, index) => (
        <TicketRow
          key={index}
          ticket={ticket}
          index={index}
          isCurrent={index === currentTicket}
          cardList={cardList}
          votesRevealed={votesRevealed}
          allParticipantsVoted={allParticipantsVoted}
          loading={loading}
          selectedVote={selectedVote}
          handleVote={handleVote}
          isModerator={isModerator}
          handleReveal={handleReveal}
          handleReset={handleReset}
          participants={participants}
          userId={userId}
        />
      ))}

      <NewTicketForm
        isModerator={isModerator}
        newTicketDescription={newTicketDescription}
        setNewTicketDescription={setNewTicketDescription}
        handleNextTicket={handleNextTicket}
        loading={loading}
      />
    </div>
  );
};

export default TicketList;
