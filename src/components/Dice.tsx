import React, { useState } from 'react';
import './Dice.css';
import diceImage from '../assets/dice.png';

interface DiceProps {
    setPoints: (points: number) => void;
    points: number;
    addHistoryEntry: (game: string, result: 'win' | 'loss', points: number, exp: number) => void;
}

const Dice: React.FC<DiceProps> = ({ setPoints, points, addHistoryEntry }) => {
    const [betAmount, setBetAmount] = useState(100); // Default bet amount set to 100
    const [rollOver, setRollOver] = useState(50.5);
    const [multiplier, setMultiplier] = useState(2.0);
    const [winChance, setWinChance] = useState(49.5);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [diceResult, setDiceResult] = useState<number | null>(null);
    const [resultColor, setResultColor] = useState<string | null>(null); // For storing the result color

    const handleRoll = () => {
        if (betAmount > points) {
            setResultMessage(`You don't have enough points to bet that amount.`);
            setResultColor('loss');
            return;
        }

        const result = Math.random() * 100;
        setDiceResult(result);

        if (result >= rollOver) {
            const profit = Math.round(betAmount * multiplier); // Round to the nearest whole number
            setPoints(points + profit); // Round the points added to the total points
            setResultMessage(`You've won ${profit} points!`);
            setResultColor('win'); // Set result color based on win
            addHistoryEntry('Dice', 'win', profit, 1);
        } else {
            setPoints(points - betAmount);
            setResultMessage(`Sadly you've lost :(`);
            setResultColor('loss'); // Set result color based on loss
            addHistoryEntry('Dice', 'loss', -betAmount, 0);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setRollOver(value);
        const newWinChance = 100 - value;
        setWinChance(newWinChance);
        const newMultiplier = (100 / newWinChance).toFixed(2);
        setMultiplier(parseFloat(newMultiplier));
    };

    const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(100, parseInt(e.target.value, 10)); // Minimum bet amount is 100
        setBetAmount(value);
    };

    return (
        <div className="dice-container">
            <div className="slider-container">
                {diceResult !== null && (
                    <div className="dice-result-indicator" style={{ left: `calc(${diceResult}% - 12.5px)` }}>
                        <img src={diceImage} alt="Dice" className="dice-image" />
                    </div>
                )}
                <input
                    type="range"
                    min="1"
                    max="99"
                    value={rollOver}
                    className="slider"
                    onChange={handleSliderChange}
                    style={{ '--slider-value': `${rollOver}%` } as React.CSSProperties}
                />
            </div>
            {resultMessage && (
                <div className={`result ${resultColor}`}>
                    {resultMessage}
                    <div>Dice Result: {diceResult?.toFixed(2)}</div>
                </div>
            )}
            <div className="betting-controls">
                <label>Bet Amount</label>
                <input
                    type="number"
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    min="100" // Minimum bet amount set to 100
                />
                <label>Profit on Win</label>
                <input type="number" value={Math.round(betAmount * multiplier)} readOnly /> {/* Rounded profit */}
            </div>
            <div className="result-controls">
                <div className="multiplier-info">
                    <label>Multiplier</label>
                    <div>{multiplier.toFixed(2)}</div>
                </div>
                <div className="multiplier-info">
                    <label>Roll Over</label>
                    <div>{rollOver.toFixed(2)}</div>
                </div>
                <div className="multiplier-info">
                    <label>Win Chance</label>
                    <div>{winChance.toFixed(2)}</div>
                </div>
            </div>
            <button className="roll-button" onClick={handleRoll} disabled={points < 100}>Roll</button>
        </div>
    );
};

export default Dice;
