import { useState } from 'preact/hooks'

const intervals = [10, 30, 60, 120];

export default function SetupPage({names, setNames, setRunning, blinkInterval, setBlinkInterval, speakInterval, setSpeakInterval}) {
    const [nameInput, setNameInput] = useState('');

    const speechEnabled = 'speechSynthesis' in window;

    function addName() {
        const name = nameInput.trim();
        if (!name) return;
        names.push(name);
        setNameInput('');
        setNames(names);
    }

    function moveName(i, j) {
        setNames(names.toSpliced(i, 1).toSpliced(j, 0, names[i]));
    }

    return (
        <div id="setup">
            <h2 id='title'>Turn Tracker</h2>
            <div id="nameList">
            {names.map((name, i) => (
                <div class="row">
                    <span id="rowname">{name}</span>
                    {<button disabled={i === 0} onclick={(e) => {moveName(i, i - 1); e.target.blur()}}>↑</button>}
                    {<button disabled={i === names.length - 1} onclick={(e) => {moveName(i, i + 1); e.target.blur()}}>↓</button>}
                    <button onclick={(e) => {setNames(names.toSpliced(i, 1))}}>x</button>
                </div>
            ))}
            </div>
            <span>
                <form onSubmit={e => {e.preventDefault(); addName()}} class="col">
                    <input id="nameInput" value={nameInput} onInput={e => setNameInput(e.target.value)} placeholder="Enter name"/>
                    <button type="submit">Add</button>
                </form>
            </span>
            <button onclick={() => setRunning(names.length > 0)}>Start</button>
            <br/>
            <em>Once started, press and hold to exit</em>
            {!speechEnabled && <em style={{color: 'red'}}><br/>Speech not supported, try a different browser</em>}
            <details open>
                <summary>Settings</summary>
                <div>
                    <div>Blink interval</div>
                    <input type="radio" name="blinkInterval" value={0} checked={blinkInterval === 0} onChange={(e) => {setBlinkInterval(0)}}/>
                    <label htmlFor={0}>off</label>
                    {intervals.map(i => (<>
                        <input type="radio" name="blinkInterval" value={i} checked={blinkInterval === i} onChange={(e) => {setBlinkInterval(i)}}/>
                        <label htmlFor={i}>{i}s</label>
                    </>))}
                </div>
                <hr/>
                <div>
                    <div>Speak interval</div>
                    <input type="radio" name="speakInterval" value={0} checked={speakInterval === 0} onChange={(e) => {setSpeakInterval(0)}} disabled={!speechEnabled}/>
                    <label htmlFor={0}>off</label>
                    {intervals.map(i => (<>
                        <input type="radio" name="speakInterval" value={i} checked={speakInterval === i} onChange={(e) => {setSpeakInterval(i)}} disabled={!speechEnabled}/>
                        <label htmlFor={i}>{i}s</label>
                    </>))}
                </div>
            </details>
        </div>
    )
}
