import { useState } from 'preact/hooks'
import SetupPage from './SetupPage.jsx'
import RunnerPage from './RunnerPage.jsx';
import './app.css'


export default function App() {
  const [running, setRunning] = useState(false);
  const [names, setNames] = useState([]);
  const [blinkInterval, setBlinkInterval] = useState(0);
  const [speakInterval, setSpeakInterval] = useState(0);

  return <>
    {!running && <SetupPage
      names={names}
      setNames={setNames}
      setRunning={setRunning}
      blinkInterval={blinkInterval}
      setBlinkInterval={setBlinkInterval}
      speakInterval={speakInterval}
      setSpeakInterval={setSpeakInterval}
    />}
    {running && <RunnerPage
      names={names}
      running={running}
      setRunning={setRunning}
      blinkInterval={blinkInterval}
      speakInterval={speakInterval}
      />
      }
  </>
}


