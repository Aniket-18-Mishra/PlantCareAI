import { AlertCircle } from 'lucide-react';

/**
 * Consistent error state display.
 */
export default function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try Again' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
      </div>
      <h3 className="font-display font-semibold text-xl text-stone-800 mb-2">{title}</h3>
      {message && (
        <p className="text-stone-500 max-w-md mb-6 text-sm leading-relaxed">{message}</p>
      )}
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
