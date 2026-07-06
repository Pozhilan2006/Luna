import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

/**
 * Root Application Router Component.
 * Uses HashRouter instead of BrowserRouter to prevent path mapping breaks 
 * when loading static resource assets from file protocols (file://) in production Electron.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
