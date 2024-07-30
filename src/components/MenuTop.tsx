import React, { useState } from 'react';
import './MenuTop.css';
import MenuSide from './MenuSide';
import MiniProfile from './MiniProfile';

interface MenuTopProps {
    onGameClick: (game: string) => void;
    points: number;
    exp: number;
    level: number;
    toggleNightMode: () => void;
    isNightMode: boolean;
}

const MenuTop: React.FC<MenuTopProps> = ({ onGameClick, points, exp, level, toggleNightMode, isNightMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const itemsMain = [
        { name: 'Mine Sweeper', onClick: () => onGameClick('MineSweeper') },
        { name: 'Wheel Of Fortune', onClick: () => onGameClick('WheelOfFortune') },
        { name: 'Dice', onClick: () => onGameClick('Dice') },
        { name: 'Roulette', onClick: () => onGameClick('Roulette') },
    ];

    const itemsSide = [
        { name: 'Profile', onClick: () => onGameClick('Profile') },
        { name: 'History', onClick: () => onGameClick('History') },
        { name: 'Deposit', onClick: () => onGameClick('ToBeImplemented') },
    ];

    return (
        <>
            <nav className="menu-top">
                <div className="left-section">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        ☰
                    </button>
                </div>
                <div className="middle-section">
                    {itemsMain.map((item, index) => (
                        <button
                            key={index}
                            className="menu-button"
                            id={`Button${item.name.replace(/\s+/g, '')}`}
                            onClick={item.onClick}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="right-section">
                    <div className="points-display">Points: {points}</div>
                    <MiniProfile exp={exp} level={level} />
                </div>
            </nav>
            <MenuSide
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onItemClick={onGameClick}
                items={itemsSide}
                toggleNightMode={toggleNightMode}
                isNightMode={isNightMode}
            />
        </>
    );
};

export default MenuTop;
