import { GameProvider, useGame } from './context/GameContext'
import MenuScreen from './components/MenuScreen'
import GameScreen from './components/GameScreen'
import './App.css'

const AppContent = () => {
    const { gameState, currentConfig, exitToMenu } = useGame();

    return (
        <div className="app-container">
            {gameState.screen === 'menu' && <MenuScreen />}
            {gameState.screen === 'game' && currentConfig && (
                <GameScreen
                    config={currentConfig}
                    onExit={exitToMenu}
                />
            )}
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    )
}

export default App
