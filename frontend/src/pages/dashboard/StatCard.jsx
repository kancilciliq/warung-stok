export default function StatCard({ label, value, variant = 'blue' }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
