import './App.css';
import MenuTop from "./components/MenuTop";
import MineSweeper from "./components/MineSweeper";
import WheelOfFortune from "./components/WheelOfFortune";
import ToBeImplemented from "./components/ToBeImplemented";
import Profile from "./components/Profile";
import Dice from "./components/Dice";
import Roulette from "./components/Roulette";
import History from "./components/History";
import { useState, useEffect } from 'react';
import Footer from "./components/Footer.tsx";

const levelRequirements = [2, 4, 8, 16, 32];

function App() {
    const [points, setPoints] = useState(10000);
    const [currentGame, setCurrentGame] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [exp, setExp] = useState(0);
    const [level, setLevel] = useState(0);
    const [isNightMode, setIsNightMode] = useState(() => {
        const savedMode = localStorage.getItem('isNightMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    useEffect(() => {
        if (isNightMode) {
            document.body.classList.add('night-mode');
            document.documentElement.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
            document.documentElement.classList.remove('night-mode');
        }
    }, [isNightMode]);

    const handleGameClick = (game: string) => {
        setCurrentGame(game);
    };

    const addHistoryEntry = (game: string, result: 'win' | 'loss', points: number, exp: number) => {
        setHistory([...history, { game, result, points, exp, date: new Date().toLocaleString() }]);
        handleAddExp(exp); // Add experience when a history entry is added
    };

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

    const formatGameName = (game: string | null) => {
        if (!game) return '';
        return game.replace(/([A-Z])/g, ' $1').trim();
    };

    const toggleNightMode = () => {
        setIsNightMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('isNightMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    return (
        <>
            <MenuTop
                onGameClick={handleGameClick}
                points={points}
                exp={exp}
                level={level}
                toggleNightMode={toggleNightMode} // Pass toggleNightMode
                isNightMode={isNightMode} // Pass isNightMode
            />
            <div className="content-container">
                {!currentGame ? (
                    <div className="container">
                        <div className="content">
                            <h1>Welcome to the Casino</h1>
                            <p>Enjoy our exciting games and have fun!</p>
                        </div>
                    </div>
                ) : (
                    <div className="current-game-container">
                        {currentGame !== 'ToBeImplemented' && (
                            <h1 className="game-title">{formatGameName(currentGame)}</h1>
                        )}
                        <div className="game-container">
                            {currentGame === 'MineSweeper' && <MineSweeper setPoints={setPoints} points={points} addHistoryEntry={addHistoryEntry} />}
                            {currentGame === 'WheelOfFortune' && <WheelOfFortune setPoints={setPoints} points={points} addHistoryEntry={addHistoryEntry} />}
                            {currentGame === 'Roulette' && <Roulette setPoints={setPoints} points={points} addHistoryEntry={addHistoryEntry} />}
                            {currentGame === 'Dice' && <Dice setPoints={setPoints} points={points} addHistoryEntry={addHistoryEntry} />}
                            {currentGame === 'ToBeImplemented' && <ToBeImplemented />}
                            {currentGame === 'Profile' && <Profile exp={exp} level={level} setExp={setExp} setLevel={setLevel} history={history} />}
                            {currentGame === 'History' && <History history={history} />}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default App;
