import { EpistemicStatus } from '../../types';
import { EPISTEMIC_REGISTRY } from '../../data/epistemicStatus';

interface EpistemicBadgeProps {
  status: EpistemicStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  interactive?: boolean;
  onInspect?: (status: EpistemicStatus) => void;
  id?: string;
}

export function EpistemicBadge({
  status,
  size = 'sm',
  showDot = true,
  interactive = false,
  onInspect,
  id,
}: EpistemicBadgeProps) {
  const meta = EPISTEMIC_REGISTRY[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 font-medium'
  }[size];

  return (
    <button
      type="button"
      id={id || `epistemic-badge-${status.toLowerCase()}`}
      onClick={() => onInspect?.(status)}
      disabled={!interactive}
      title={`${meta.label}: ${meta.shortDefinition}`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono transition-all uppercase whitespace-nowrap ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${sizeClasses} ${
        interactive ? 'hover:scale-105 hover:brightness-125 cursor-pointer shadow-sm shadow-cyan-950/20' : 'cursor-default'
      }`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor} animate-pulse`} />
      )}
      <span>{meta.label}</span>
    </button>
  );
}
