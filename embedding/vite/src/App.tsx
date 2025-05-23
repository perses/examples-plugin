import { Header } from './Header';
import PersesDashboard from './components/PersesDashboard';
import { PersesPluginWrapper } from './components/PersesPluginWrapper';
import persesLogo from '/src/assets/perses.svg';

function App() {
  return (
    <>
      <Header logo={persesLogo} />

      <PersesDashboard />
      <PersesPluginWrapper />
    </>
  );
}

export default App;
