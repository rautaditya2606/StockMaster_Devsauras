export default function StatusBadge({ status }) {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';

  const statusClasses = {
    // Document Status
    DRAFT: 'bg-gray-100 text-gray-800',
    WAITING: 'bg-yellow-100 text-yellow-800',
    READY: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',

    // Task Status
    PENDING: 'bg-yellow-100 text-yellow-800',
    ONGOING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  const classes = `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;

  return <span className={classes}>{status}</span>;
}

