import React from 'react';
import styles from '../../styles/poker.module.css';

const NewTicketForm = ({ isModerator, newTicketDescription, setNewTicketDescription, handleCreateTicket, loading }) => {
  if (!isModerator) return null;

  return (
    <div className={styles.newTicketForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="newTicketInput">Add New Ticket</label>
        <div className={styles.newTicketInputGroup}>
          <input
            id="newTicketInput"
            type="text"
            placeholder="Ticket description"
            value={newTicketDescription}
            onChange={(e) => setNewTicketDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && newTicketDescription.trim() && handleCreateTicket()}
            className={styles.newTicketInput}
          />
          <button
            onClick={handleCreateTicket}
            disabled={loading || !newTicketDescription.trim()}
            className={styles.newTicketButton}
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTicketForm;
