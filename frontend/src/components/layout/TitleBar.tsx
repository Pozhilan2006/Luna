import { electronService } from '@/services/electron';
import { Minus, Square, X } from 'lucide-react';

/**
 * Custom frameless titlebar offering maximize, minimize, close controls
 * and providing a drag handle for moving the window.
 */
export default function TitleBar() {
  return (
    <div className="h-10 bg-surface border-b border-border flex items-center justify-between drag-region px-4 select-none shrink-0">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-accent font-black tracking-wider text-xs">LUNA</span>
        <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest opacity-80">
          Desktop
        </span>
      </div>
      
      {/* OS window control buttons */}
      <div className="flex items-center no-drag-region h-full">
        <button
          onClick={electronService.minimizeWindow}
          className="hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors h-full flex items-center justify-center w-10 cursor-pointer"
          aria-label="Minimize"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={electronService.maximizeWindow}
          className="hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors h-full flex items-center justify-center w-10 cursor-pointer"
          aria-label="Maximize"
        >
          <Square size={10} />
        </button>
        <button
          onClick={electronService.closeWindow}
          className="hover:bg-rose-500/20 text-text-secondary hover:text-rose-400 transition-colors h-full flex items-center justify-center w-10 cursor-pointer"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
