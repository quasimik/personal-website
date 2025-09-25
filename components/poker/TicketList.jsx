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
  // Check if waiting for more tickets (either no tickets or all done)
  const waitingForTickets = currentTicket >= tickets.length;

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

      {waitingForTickets && (
        <div className={styles.waitingForTicketsMarker}>
          <div className={styles.waitingForTicketsContent}>
            <span className={styles.waitingForTicketsIcon}>🎉</span>
            <h3>All tickets processed!</h3>
            <p>Waiting for more tickets...</p>
          </div>
        </div>
      )}

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
