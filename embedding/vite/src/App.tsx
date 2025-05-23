import { Header } from './Header';
import { PersesWrapper } from './PersesWrapper';
import persesLogo from '/src/assets/perses.svg';

function App() {
  return (
    <>
      <Header logo={persesLogo} />

      <PersesWrapper />
    </>
  );
}

export default App;
