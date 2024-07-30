import React, { useState } from 'react';
import './WheelOfFortune.css';

const createSegments = () => {
    const pattern = [
        'gold', 'blue',
        'black', 'red', 'black', 'red', 'black', 'red', 'black',
        'blue', 'black', 'blue',
        'black', 'red', 'black', 'red', 'black', 'red', 'black',
        'blue', 'black', 'blue',
        'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black',
        'blue', 'black', 'blue',
        'black', 'red', 'black', 'red', 'black', 'red', 'black',
        'blue', 'black', 'blue',
        'black', 'red', 'black', 'red', 'black', 'red', 'black',
        'blue'
    ];

    const segments = pattern.map((color, index) => ({
        color,
        rotation: (360 / pattern.length) * index,
    }));

    return segments;
};

interface WheelOfFortuneProps {
    setPoints: (points: number) => void;
    points: number;
    addHistoryEntry: (game: string, result: 'win' | 'loss', points: number, exp: number) => void;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ setPoints, points, addHistoryEntry }) => {
    const [rotation, setRotation] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [betColor, setBetColor] = useState<string | null>(null);
    const [betTokens, setBetTokens] = useState<number>(100);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [resultMessageColor, setResultMessageColor] = useState<string | undefined>(undefined);
    const segments = createSegments();
    const initialRotation = 266.5;

    const spinWheel = () => {
        if (betTokens < 100) {
            setResultMessage("");
            setError('You must bet at least 100 tokens.');
            return;
        }
        if (betTokens > points) {
            setResultMessage("");
            setError('Not enough points.');
            return;
        }
        if (!betColor) {
            setResultMessage("");
            setError('You must select a color to bet.');
            return;
        }
        setError(null); // Clear previous errors
        setIsSpinning(true); // Disable buttons during spin
        setResultMessage(null); // Clear previous result message
        setResultMessageColor(undefined); // Clear previous result message color
        const newRotation = rotation + Math.floor(Math.random() * 360) + 360 * 3; // Spin at least 3 times
        setRotation(newRotation);
        setTimeout(() => {
            const normalizedRotation = (newRotation % 360);
            const segmentAngle = 360 / segments.length;
            const segmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
            setHighlightedIndex(segmentIndex);
            const selectedColor = segments[segmentIndex].color;
            setSelectedColor(selectedColor);
            if (betColor === selectedColor) {
                let multiplier = 0;
                let exp = 1;
                switch (selectedColor) {
                    case 'red':
                        multiplier = 3;
                        break;
                    case 'black':
                        multiplier = 2;
                        break;
                    case 'gold':
                        multiplier = 50;
                        exp = 5;
                        break;
                    case 'blue':
                        multiplier = 5;
                        break;
                    default:
                        multiplier = 0;
                }
                const wonPoints = betTokens * multiplier;
                setPoints(points + wonPoints);
                setResultMessage(`You've won ${wonPoints} points!`);
                setResultMessageColor('green');
                addHistoryEntry('Wheel Of Fortune', 'win', wonPoints, exp); // Add win entry
            } else {
                setPoints(points - betTokens);
                setResultMessage(`Sadly you've lost :(`);
                setResultMessageColor('red');
                addHistoryEntry('Wheel Of Fortune', 'loss', -betTokens, 0); // Add loss entry
            }
            setIsSpinning(false); // Enable buttons after spin
        }, 6000); // Delay until the rotation ends
    };

    const handleBetColor = (color: string) => {
        setBetColor(color);
    };

    const handleBetTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(100, Math.min(points, Number(event.target.value)));
        setBetTokens(value);
    };

    return (
        <div className="wheel-container">
            <div className="wheel-wrapper">
                <svg
                    height="65"
                    width="65"
                    xmlns="http://www.w3.org/2000/svg"
                    className="wheel-arrow"
                    style={{ fill: selectedColor ?? 'white' }}
                >
                    <polygon points="55,20 10,20 32.5,50" style={{ stroke: 'white', strokeWidth: 3 }} />
                </svg>
                <svg className="wheel" viewBox="0 0 100 100" style={{ transform: `rotate(${initialRotation + rotation}deg)` }}>
                    {segments.map((segment, index) => (
                        <path
                            key={index}
                            d={`
                                M ${50 + 45 * Math.cos(2 * Math.PI * index / segments.length)} ${50 + 45 * Math.sin(2 * Math.PI * index / segments.length)}
                                A 45 45 0 0 1 ${50 + 45 * Math.cos(2 * Math.PI * (index + 1) / segments.length)} ${50 + 45 * Math.sin(2 * Math.PI * (index + 1) / segments.length)}
                                A 35 35 0 0 0 ${50 + 35 * Math.cos(2 * Math.PI * (index + 1) / segments.length)} ${50 + 35 * Math.sin(2 * Math.PI * (index + 1) / segments.length)}
                                A 35 35 0 0 1 ${50 + 35 * Math.cos(2 * Math.PI * index / segments.length)} ${50 + 35 * Math.sin(2 * Math.PI * index / segments.length)}
                                Z
                            `}
                            fill={segment.color}
                            stroke={highlightedIndex === index && !isSpinning ? "yellow" : "#fff"}
                            strokeWidth="0.5"
                        />
                    ))}
                </svg>
                {resultMessage && (
                    <div className="result-message" style={{ color: resultMessageColor }}>
                        {resultMessage}
                    </div>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>Spin</button>
            <div className="betting-controls">
                <label>
                    Bet Tokens:
                    <input type="number" value={betTokens} onChange={handleBetTokens} min="0" disabled={isSpinning} />
                </label>
                <div className="betting-buttons">
                    <button
                        onClick={() => handleBetColor('black')}
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: betColor === 'black' ? '3px solid #1ABC9C' : 'none'
                        }}
                        disabled={isSpinning}
                    >
                        Black (2x)
                    </button>
                    <button
                        onClick={() => handleBetColor('red')}
                        style={{
                            backgroundColor: 'red',
                            border: betColor === 'red' ? '3px solid #1ABC9C' : 'none'
                        }}
                        disabled={isSpinning}
                    >
                        Red (3x)
                    </button>
                    <button
                        onClick={() => handleBetColor('blue')}
                        style={{
                            backgroundColor: 'blue',
                            border: betColor === 'blue' ? '3px solid #1ABC9C' : 'none'
                        }}
                        disabled={isSpinning}
                    >
                        Blue (5x)
                    </button>
                    <button
                        onClick={() => handleBetColor('gold')}
                        style={{
                            backgroundColor: '#bdb20a',
                            color: 'white',
                            border: betColor === 'gold' ? '4px solid #1ABC9C' : 'none'
                        }}
                        disabled={isSpinning}
                    >
                        Gold (50x)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WheelOfFortune;
