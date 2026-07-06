import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Settings, Activity } from 'lucide-react';

/**
 * Main application navigation sidebar.
 */
export default function Sidebar() {
  const links = [
    { to: '/', label: 'Home Dashboard', icon: Home },
    { to: '/chat', label: 'AI Chatbot', icon: MessageSquare },
    { to: '/settings', label: 'User Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col justify-between p-4 select-none shrink-0 h-full">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center space-x-2 text-text-secondary">
          <Activity size={14} className="text-accent" />
          <h2 className="text-[10px] font-extrabold uppercase tracking-widest">
            Core Modules
          </h2>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/25 shadow-sm'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-transparent'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border pt-4 px-3 flex items-center space-x-3 text-xs text-text-secondary">
        <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
          L
        </div>
        <div>
          <p className="font-bold text-text-primary">Luna Engine</p>
          <p className="text-[10px] opacity-75">v0.1.0</p>
        </div>
      </div>
    </div>
  );
}
