import { useState } from 'react'
import MenuScreen from './components/MenuScreen'
import GameScreen from './components/GameScreen'
import { GameConfig } from './types'
import './App.css'

function App() {
    const [screen, setScreen] = useState<'menu' | 'game'>('menu');
    const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

    const startGame = (config: GameConfig) => {
        setGameConfig(config);
        setScreen('game');
    };

    const returnToMenu = () => {
        setScreen('menu');
        setGameConfig(null);
    };

    return (
        <div className="app-container">
            {screen === 'menu' && <MenuScreen onStartGame={startGame} />}
            {screen === 'game' && gameConfig && <GameScreen config={gameConfig} onExit={returnToMenu} />}
        </div>
    )
}

export default App
