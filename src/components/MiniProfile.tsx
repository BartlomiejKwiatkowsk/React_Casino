import React from 'react';
import './MiniProfile.css';
import avatar from '../assets/avatar.png';

const levelRequirements = [2, 4, 8, 16, 32];

interface MiniProfileProps {
    exp: number;
    level: number;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ exp, level }) => {
    const nextLevelExp = level < levelRequirements.length ? levelRequirements[level] : 0;
    const progressPercentage = nextLevelExp > 0 ? (exp / nextLevelExp) * 100 : 100;

    return (
        <div className="mini-profile-container">
            <img src={avatar} alt="Avatar" className="mini-avatar" />
            <div className="mini-info">
                <div className="mini-level">Level: {level}</div>
                <div className="mini-progress-bar">
                    <div className="mini-progress" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default MiniProfile;
