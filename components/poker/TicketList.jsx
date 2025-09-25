import React from 'react';
import styles from '../../styles/poker.module.css';
import TicketRow from './TicketRow';
import NewTicketForm from './NewTicketForm';

const TicketList = ({
  tickets,
  currentTicket,
  cardList,
  votesRevealed,
  loading,
  selectedVote,
  handleVote,
  isModerator,
  newTicketDescription,
  setNewTicketDescription,
  handleCreateTicket,
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
    <div className={styles.ticketsArea}>
      {tickets.map((ticket, index) => (
        <TicketRow
          key={index}
          ticket={ticket}
          index={index}
          isCurrent={index === currentTicket}
          cardList={cardList}
          votesRevealed={votesRevealed}
          loading={loading}
          selectedVote={selectedVote}
          handleVote={handleVote}
          isModerator={isModerator}
          handleReveal={handleReveal}
          handleReset={handleReset}
          participants={participants}
          userId={userId}
          handleAcceptTicket={handleAcceptTicket}
          handleSkipTicket={handleSkipTicket}
          selectedEstimate={selectedEstimate}
          setSelectedEstimate={setSelectedEstimate}
        />
      ))}

      <NewTicketForm
        isModerator={isModerator}
        newTicketDescription={newTicketDescription}
        setNewTicketDescription={setNewTicketDescription}
        handleCreateTicket={handleCreateTicket}
        loading={loading}
      />
    </div>
  );
};

export default TicketList;
