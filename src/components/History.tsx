import React from 'react';
import './History.css';

interface HistoryEntry {
    game: string;
    result: 'win' | 'loss';
    points: number;
    exp: number;
}

interface HistoryProps {
    history: HistoryEntry[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
    return (
        <div className="history-container">
            <h2>Game History</h2>
            <ul className="history-list">
                {history.map((entry, index) => (
                    <li
                        key={index}
                        className={`history-item ${entry.result}`}
                    >
                        <span className="game-name">{entry.game}</span>
                        <span className="result-points">{entry.points} points</span>
                        <span className="result-exp">{entry.exp} EXP</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
