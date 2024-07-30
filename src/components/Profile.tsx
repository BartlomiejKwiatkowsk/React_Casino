import React from 'react';
import './Profile.css';
import avatar from '../assets/avatar.png';

const levelRequirements = [2, 4, 8, 16, 32];

interface ProfileProps {
    exp: number;
    level: number;
    setExp: (exp: number) => void;
    setLevel: (level: number) => void;
    history: any[];
}

const Profile: React.FC<ProfileProps> = ({ exp, level, setExp, setLevel, history }) => {
    const handleAddExp = (amount: number) => {
        let newExp = exp + amount;
        let newLevel = level;

        while (newLevel < levelRequirements.length && newExp >= levelRequirements[newLevel]) {
            newExp -= levelRequirements[newLevel];
            newLevel++;
        }

        setExp(newExp);
        setLevel(newLevel);
    };

    const nextLevelExp = level < levelRequirements.length ? levelRequirements[level] : 0;
    const progressPercentage = nextLevelExp > 0 ? (exp / nextLevelExp) * 100 : 100;

    const calculateStats = () => {
        const stats = {
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            pointsEarned: 0,
            winRate: 0,
            bestGame: '',
            bestWinRate: 0,
        };

        const gameStats: { [key: string]: { wins: number, losses: number, pointsEarned: number } } = {};

        history.forEach((entry) => {
            stats.totalGames += 1;
            if (entry.result === 'win') {
                stats.totalWins += 1;
                stats.pointsEarned += entry.points;
            } else {
                stats.totalLosses += 1;
            }

            if (!gameStats[entry.game]) {
                gameStats[entry.game] = { wins: 0, losses: 0, pointsEarned: 0 };
            }

            if (entry.result === 'win') {
                gameStats[entry.game].wins += 1;
                gameStats[entry.game].pointsEarned += entry.points;
            } else {
                gameStats[entry.game].losses += 1;
            }
        });

        stats.winRate = stats.totalGames > 0 ? (stats.totalWins / stats.totalGames) * 100 : 0;

        Object.keys(gameStats).forEach((game) => {
            const gameWinRate = gameStats[game].wins + gameStats[game].losses > 0
                ? (gameStats[game].wins / (gameStats[game].wins + gameStats[game].losses)) * 100
                : 0;
            if (gameWinRate > stats.bestWinRate) {
                stats.bestWinRate = gameWinRate;
                stats.bestGame = game;
            }
        });

        return stats;
    };

    const stats = calculateStats();

    return (
        <div className="profile-container">
            <div className="avatar">
                <img src={avatar} alt="Avatar" />
            </div>
            <div className="username">Guest</div>
            <div className="level">Level: {level}</div>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            {level < levelRequirements.length ? (
                <div className="exp-info" style={{ color: 'green' }}>
                    {exp}/{nextLevelExp} EXP to next level
                </div>
            ) : (
                <div className="exp-info" style={{ color: 'green' }}>
                    Max Level Reached
                </div>
            )}
            <button className="add-exp-button" onClick={() => handleAddExp(1)}>Add 1 EXP</button>
            <div className="stats-container">
                <h3>Statistics</h3>
                <table className="stats-table">
                    <tbody>
                    <tr>
                        <td>Total Games:</td>
                        <td>{stats.totalGames}</td>
                    </tr>
                    <tr>
                        <td>Total Wins:</td>
                        <td>{stats.totalWins}</td>
                    </tr>
                    <tr>
                        <td>Total Losses:</td>
                        <td>{stats.totalLosses}</td>
                    </tr>
                    <tr>
                        <td>Win Rate:</td>
                        <td>{stats.winRate.toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td>Points Earned:</td>
                        <td>{stats.pointsEarned}</td>
                    </tr>
                    <tr>
                        <td>Best Game:</td>
                        <td>{stats.bestGame} ({stats.bestWinRate.toFixed(2)}%)</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;
