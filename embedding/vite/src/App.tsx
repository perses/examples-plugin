import { PersesWrapper } from './PersesWrapper';
import persesLogo from '/src/assets/perses.svg';

function App() {
  return (
    <>
      <div>
        <a href="https://perses.dev" target="_blank">
          <img src={persesLogo} className="logo" alt="Perses logo" />
        </a>
      </div>

      <div>
        <h1>Plugin Embedding - Single Panel</h1>
      </div>

      <PersesWrapper />
    </>
  );
}

export default App;
