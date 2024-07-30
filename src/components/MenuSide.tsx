import React from 'react';
import './MenuSide.css';

interface MenuSideProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    onItemClick: (item: string) => void;
    items: { name: string; onClick: () => void; }[];
    toggleNightMode: () => void; // Add this prop
    isNightMode: boolean; // Add this prop
}

const MenuSide: React.FC<MenuSideProps> = ({ isOpen, toggleSidebar, items, toggleNightMode, isNightMode }) => {
    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                <ul>
                    {items.map((item, index) => (
                        <li
                            key={index}
                            id={`SidebarButton${item.name.replace(/\s+/g, '')}`}
                            onClick={() => {
                                item.onClick();
                                toggleSidebar();
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
                <div className="night-mode-container">
                    <label className="night-mode-label">Night Mode</label>
                    <label className="switch">
                        <input type="checkbox" checked={isNightMode} onChange={toggleNightMode} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default MenuSide;
