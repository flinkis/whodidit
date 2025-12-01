import { GameProvider, useGame } from './context/GameContext'
import { ModalProvider } from './context/ModalContext'
import MenuScreen from './components/MenuScreen'
import GameScreen from './components/GameScreen'
import ModalRoot from './components/ModalRoot'
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
            <ModalRoot />
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </GameProvider>
    )
}

export default App
