export default function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert alert-error">
      <span>{message}</span>
      {onRetry && <button type="button" className="btn btn-sm" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}
