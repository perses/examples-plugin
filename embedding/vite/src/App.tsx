import { useState } from 'react';
import { Header } from './Header';
import PersesDashboard from './components/PersesDashboard';
import { PersesPluginWrapper } from './components/PersesPluginWrapper';
import persesLogo from '/src/assets/perses.svg';

function App() {
  const [view, setView] = useState<'dashboard' | 'panel'>('dashboard');

  return (
    <>
      <Header logo={persesLogo} onNavigate={setView} />
      {view === 'dashboard' && <PersesDashboard />}
      {view === 'panel' && <PersesPluginWrapper />}
    </>
  );
}

export default App;
