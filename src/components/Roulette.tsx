import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Roulette.css';

interface RouletteProps {
    setPoints: (points: number) => void;
    points: number;
    addHistoryEntry: (game: string, result: 'win' | 'loss', points: number, exp: number) => void;
}

type Color = 'red' | 'black' | 'green';

const generateColors = () => {
    const colors: Color[] = [];
    for (let i = 0; i < 18; i++) {
        colors.push('red', 'black');
    }
    const greenIndex = Math.floor(Math.random() * colors.length);
    colors.splice(greenIndex, 0, 'green');
    return colors;
};

const Roulette: React.FC<RouletteProps> = ({ setPoints, points, addHistoryEntry }) => {
    const [betAmount, setBetAmount] = useState<number>(100);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [colors] = useState<Color[]>(generateColors());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

    const drawWheel = useCallback((context: CanvasRenderingContext2D, offset: number, highlightIndex: number | null) => {
        const slotWidth = 40;
        const totalSlots = colors.length * 7; // Adjusted to handle the duplicated slots for continuous scrolling
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for (let i = 0; i < totalSlots; i++) {
            const color = colors[i % colors.length];
            context.fillStyle = color;
            context.fillRect((i * slotWidth) - offset, 0, slotWidth, context.canvas.height);

            if (highlightIndex !== null && i % colors.length === highlightIndex) {
                context.strokeStyle = 'white';
                context.lineWidth = 5;
                context.strokeRect((i * slotWidth) - offset, 0, slotWidth, context.canvas.height);
            }
        }

        // Draw the yellow center line
        const centerX = context.canvas.width / 2;
        context.strokeStyle = 'yellow';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(centerX, 0);
        context.lineTo(centerX, context.canvas.height);
        context.stroke();
    }, [colors]);

    const spinWheel = useCallback(() => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        let start: number | null = null;
        const duration = 4000; // Increase the duration to 4 seconds for more rotations
        const slotWidth = 40;
        const fullRotationOffset = colors.length * slotWidth;
        const extraRotations = 3; // Number of additional rotations
        const centerSlotIndex = 4; // The index of the center slot in the visible area
        const targetSlot = Math.floor(Math.random() * colors.length);
        const winningSlotIndex = (targetSlot + 4) % colors.length; // 4 slots to the right
        const targetOffset = (targetSlot * slotWidth) + (context.canvas.width / 2) - (centerSlotIndex * slotWidth) + (extraRotations * fullRotationOffset) - 20;
        let currentOffset = 0;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;

            const progress = Math.min(elapsed / duration, 1);
            currentOffset = ((fullRotationOffset * 3) + (targetOffset * easeOutCubic(progress))) % (fullRotationOffset * 3); // Use modulo for continuous effect
            drawWheel(context, currentOffset, null);

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                setHighlightIndex(winningSlotIndex);
                const rolledColor = colors[winningSlotIndex];
                let winnings = 0;
                let exp = 0;
                if (rolledColor === selectedColor) {
                    if (rolledColor === 'red' || rolledColor === 'black') {
                        winnings = betAmount * 2;
                        exp = 1;
                    } else if (rolledColor === 'green') {
                        winnings = betAmount * 36;
                        exp = 1;
                    }
                }

                // Highlight the winning slot after spinning
                drawWheel(context, currentOffset, winningSlotIndex);

                if (winnings > 0) {
                    setPoints(points + winnings);
                    setMessage(`You've won ${winnings} points!`);
                    addHistoryEntry('Roulette', 'win', winnings, exp);
                } else {
                    setPoints(points - betAmount);
                    setMessage(`Sadly you've lost :(`);
                    addHistoryEntry('Roulette', 'loss', -betAmount, 0);
                }
                setTimeout(() => {
                    setIsSpinning(false);
                }, 200);
            }
        };

        requestAnimationFrame(animate);
    }, [betAmount, colors, selectedColor, setPoints, points, addHistoryEntry, drawWheel]);

    useEffect(() => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            drawWheel(context, 0, null); // Initialize with null for highlightIndex
        }
    }, [drawWheel]);

    const handleBet = () => {
        if (isSpinning) return; // Prevent betting while spinning
        if (selectedColor === null) {
            setMessage("Please select a color to bet on.");
            return;
        }
        if (betAmount > points) {
            setMessage("You don't have enough points to bet that amount.");
            return;
        }

        setIsSpinning(true);
        setMessage(null);
        setHighlightIndex(null); // Remove highlight before starting a new spin
        spinWheel();
    };

    return (
        <div className="roulette-container">
            <div className="roulette-wheel-container">
                <canvas ref={canvasRef} width={360} height={50}></canvas>
            </div>
            <div className="betting-controls">
                <label>Bet Amount:</label>
                <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(100, Math.min(Number(e.target.value), points)))}
                    min="100"
                />
                <div className="color-buttons">
                    <button
                        className={`bet-button red ${selectedColor === 'red' ? 'selected' : ''}`}
                        onClick={() => setSelectedColor('red')}
                        disabled={isSpinning}
                    >
                        Red (2x)
                    </button>
                    <button
                        className={`bet-button black ${selectedColor === 'black' ? 'selected' : ''}`}
                        onClick={() => setSelectedColor('black')}
                        disabled={isSpinning}
                    >
                        Black (2x)
                    </button>
                    <button
                        className={`bet-button green ${selectedColor === 'green' ? 'selected' : ''}`}
                        onClick={() => setSelectedColor('green')}
                        disabled={isSpinning}
                    >
                        Green (36x)
                    </button>
                </div>
                <button onClick={handleBet} className="bet-button" disabled={isSpinning || betAmount > points}>
                    Place Bet
                </button>
            </div>
            {message && (
                <div className={`message ${message.includes('won') ? 'win' : 'loss'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
};

export default Roulette;
