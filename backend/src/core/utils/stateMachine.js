/**
 * Document state machine transitions
 * 
 * Valid transitions:
 * draft → waiting → ready → done
 * draft → canceled
 * waiting → canceled
 * ready → canceled
 */

const VALID_TRANSITIONS = {
  DRAFT: ['WAITING', 'CANCELED'],
  WAITING: ['READY', 'CANCELED'],
  READY: ['DONE', 'CANCELED'],
  DONE: [], // Terminal state
  CANCELED: [], // Terminal state
};

export const canTransition = (currentStatus, newStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
};

export const validateTransition = (currentStatus, newStatus) => {
  if (!canTransition(currentStatus, newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }
};

