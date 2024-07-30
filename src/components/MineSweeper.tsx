import { useState } from 'react';
import './MineSweeper.css';

interface MineSweeperProps {
    setPoints: (points: number) => void;
    points: number;
    addHistoryEntry: (game: string, result: 'win' | 'loss', points: number, exp: number) => void;
}

const generateGrid = (numBombs: number) => {
    const grid = [];
    const bombPositions = new Set<number>();

    while (bombPositions.size < numBombs) {
        bombPositions.add(Math.floor(Math.random() * 25));
    }

    for (let i = 0; i < 25; i++) {
        grid.push({
            hasBomb: bombPositions.has(i),
            isFlipped: false,
            multiplier: 0,
        });
    }

    return grid;
};

const getInitialMultiplier = (numBombs: number) => {
    switch (numBombs) {
        case 3: return 1.0;
        case 9: return 1.4;
        case 16: return 3.5;
        case 24: return 25.0;
        default: return 0.5;
    }
}

const getIncrementMultiplier = (numBombs: number) => {
    switch (numBombs) {
        case 3: return 0.18;
        case 9: return 0.25;
        case 16: return 0.38;
        case 24: return 1;
        default: return 0.1;
    }
}

const MineSweeper = ({ setPoints, points, addHistoryEntry }: MineSweeperProps) => {
    const [grid, setGrid] = useState(generateGrid(3));
    const [gameActive, setGameActive] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [numBombs, setNumBombs] = useState(3);
    const [betPoints, setBetPoints] = useState(100);
    const [potentialPoints, setPotentialPoints] = useState(0);
    const [cashoutMessage, setCashoutMessage] = useState('');
    const [multiplier, setMultiplier] = useState(getInitialMultiplier(3));
    const [cellsOpened, setCellsOpened] = useState(false); // New state to track if any cell is opened

    const startGame = () => {
        const adjustedBetPoints = Math.min(Math.max(betPoints, 100), points);
        setBetPoints(adjustedBetPoints);
        if (adjustedBetPoints > points) {
            return;
        }
        const newGrid = generateGrid(numBombs);
        setGrid(newGrid);
        setGameActive(true);
        setGameLost(false);
        setPoints(points - adjustedBetPoints);
        setPotentialPoints(adjustedBetPoints);
        setCashoutMessage('');
        setMultiplier(getInitialMultiplier(numBombs));
        setCellsOpened(false); // Reset the cells opened tracker
    };

    const resetGame = () => {
        setGrid(generateGrid(numBombs));
        setGameActive(false);
        setGameLost(false);
        setPotentialPoints(0);
        setCashoutMessage('');
    };

    const handleCellClick = (index: number) => {
        if (!gameActive || gameLost || grid[index].isFlipped) return;

        const newGrid = grid.slice();
        if (newGrid[index].hasBomb) {
            newGrid.forEach((cell) => {
                if (cell.hasBomb) {
                    cell.isFlipped = true;
                }
            });
            setGameLost(true);
            setGameActive(false);
            setPotentialPoints(0);
            setCashoutMessage('');
            if (cellsOpened) { // Only add to history if a cell was opened
                addHistoryEntry('Mine Sweeper', 'loss', -betPoints, 0); // Add loss entry
            }
        } else {
            newGrid[index].isFlipped = true;
            newGrid[index].multiplier = multiplier;

            const newPotentialPoints = Math.round(betPoints * multiplier);
            setPotentialPoints(newPotentialPoints);

            const incrementMultiplier = getIncrementMultiplier(numBombs);
            setMultiplier(multiplier * (1 + incrementMultiplier));
            setCellsOpened(true); // Mark that a cell has been opened
        }
        setGrid(newGrid);
    };

    const cashOut = () => {
        setPoints(points + potentialPoints);
        setCashoutMessage(`Successfully cashed out with ${potentialPoints} tokens!`);
        if (cellsOpened) { // Only add to history if a cell was opened
            addHistoryEntry('Mine Sweeper', 'win', potentialPoints, 1); // Add win entry
        }
        resetGame();
    };

    const bombOptions = [3, 9, 16, 24];

    return (
        <div className="minesweeper-container">
            <div className="settings">
                <div>
                    <label>Number of Bombs:</label>
                    <div className="bomb-options">
                        {bombOptions.map(option => (
                            <div
                                key={option}
                                className={`bomb-option ${numBombs === option ? 'active' : ''}`}
                                onClick={() => !gameActive && setNumBombs(option)}
                                style={{ pointerEvents: gameActive ? 'none' : 'auto', opacity: gameActive ? 0.5 : 1 }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="points-input">
                    <label>Bet Points:</label>
                    <input
                        type="number"
                        value={betPoints}
                        onChange={(e) => setBetPoints(Math.max(100, Math.min(parseInt(e.target.value), points)))}
                        min="100"
                        max={points}
                        disabled={gameActive}
                    />
                </div>
                <button onClick={!gameActive ? startGame : cashOut}>
                    {!gameActive ? 'Start' : 'Cashout'}
                </button>
                <div>
                    <span>Points: {points}</span>
                </div>
                {gameActive && potentialPoints > 0 && (
                    <div className="potential-points">Potential Cashout: {potentialPoints}</div>
                )}
                {gameLost && <div className="message">You Lose</div>}
                {cashoutMessage && <div className="cashout-message">{cashoutMessage}</div>}
            </div>
            <div className="minesweeper">
                <div className="grid">
                    {grid.map((cell, index) => (
                        <div
                            key={index}
                            className={`cell ${cell.isFlipped ? 'flipped' : ''}`}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell.isFlipped ? (cell.hasBomb ? '💣' : '') : ''}
                            {cell.isFlipped && !cell.hasBomb && (
                                <div className="multiplier">
                                    {cell.multiplier.toFixed(2)}x
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MineSweeper;
