import "./App.css";
import { useRef, useState } from "react";
import * as utils from './utils/utils'
const App = () => {
  const [lock, setLock] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const reset = useRef(false);
  const moves = useRef([]);
  const sequence =  useRef([]);
  
  const handleReset = async () => {
    // flushed current sequence if it was pressed in the middle of the game
    reset.current = true;

    const board = document.getElementsByClassName(`board `)[0];
    board.classList.add("reset");
    await utils.timer(1000);
    board.classList.remove("reset");

    reset.current = false;

    moves.current = [];
    sequence.current = [];
    setMessage("");
    setScore(0);
    addMove();
  };

  const addMove = async () => {
    setLock("locked");
    const row = utils.getRandomNumber();
    const cell = utils.getRandomNumber();
    const cellValue = JSON.stringify(row) + cell;
    moves.current.push(cellValue);
    
    sequence.current.push(...JSON.parse(JSON.stringify(moves.current)))
    
    for (const move of moves.current) {
      if (reset.current) {
        break;
      } else {
        await utils.timer(1000)
        const cellBox = document.getElementsByClassName(`cell-${move}`)[0];
        cellClick(cellBox);
      }
    }

    if (reset) reset.current = false;
    setLock("");
  };

  const cellClick = (cell) => {
    cell.classList.add("active");
    setTimeout(() => {
      cell.classList.remove("active");
    }, 800);
  };

  const checkSequence = (cell) => {
    const correctMove = sequence.current[0];
    sequence.current = sequence.current.slice(1)
    cellClick(cell);

    if (correctMove === cell.attributes.value.value && !sequence.current.length) {
      setScore(score + 1);
      setTimeout(() => addMove(), 1000);
    } else if (correctMove !== cell.attributes.value.value) {
      setMessage("You lost!");
    }
  };

  return (
    <>
      <h1 className="message">{message}</h1>
      <button onClick={handleReset}>
        <h2>New game</h2>
      </button>
      <h1 className="score">Score: {score}</h1>
      <div className={["board", lock].join(" ")}>
        {[...Array(3)].map((_, rowIndex) => (
          <div className={`row-${rowIndex + 1}`} key={rowIndex}>
            {[...Array(3)].map((_, cellIndex) => {
              const cellValue = JSON.stringify(rowIndex + 1) + (cellIndex + 1);
              return (
                <div
                  className={`cell-${cellValue}`}
                  key={cellIndex}
                  value={cellValue}
                  onClick={(e) => checkSequence(e.target)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
