export default function StatusBadge({ status }) {
  const statusMap = {
    confirmed: { label: 'Confirmed', className: 'bg-success-bg text-success' },
    pending: { label: 'Pending', className: 'bg-warning-bg text-warning' },
    cancelled: { label: 'Cancelled', className: 'bg-error-bg text-error' },
    completed: { label: 'Completed', className: 'bg-success-bg text-success' },
  }

  const config = statusMap[status] || statusMap.pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  )
}
