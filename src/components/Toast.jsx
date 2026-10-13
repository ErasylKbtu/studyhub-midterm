import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onDismiss }) {
  if (!message) return null;
  return <div className="toast" role="status"><span className="toast-icon"><CheckCircle2 size={20}/></span><span>{message}</span><button type="button" onClick={onDismiss} aria-label="Dismiss notification"><X size={17}/></button></div>;
}
