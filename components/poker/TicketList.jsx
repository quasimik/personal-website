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
  hasVoted,
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
  if (!tickets || tickets.length === 0) {
    return (
      <div className={styles.noTickets}>
        <h2>No Tickets Yet</h2>
        <NewTicketForm
          isModerator={isModerator}
          newTicketDescription={newTicketDescription}
          setNewTicketDescription={setNewTicketDescription}
          handleNextTicket={handleNextTicket}
          loading={loading}
        />
      </div>
    );
  }

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
          hasVoted={hasVoted}
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
