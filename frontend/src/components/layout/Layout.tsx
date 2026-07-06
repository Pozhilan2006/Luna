import { Outlet } from 'react-router-dom';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';

/**
 * Master layout shell. Incorporates the frameless title bar, the sidebar menu,
 * and the main content router viewport.
 */
export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-primary">
      {/* Borderless TitleBar window header */}
      <TitleBar />
      
      {/* Nested workspace workspace shell */}
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        
        {/* Core application body viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-8 no-drag-region">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
