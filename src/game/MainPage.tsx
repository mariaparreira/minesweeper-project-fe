import React, { /*useEffect,*/ useState } from 'react';
import { withSound, WithSoundProps } from '../sound/withSound';
import { SoundContainer } from '../sound/SoundContainer';
import './MainPage.css';
import '../styles.css';
import { MinesweeperGame } from './MinesweeperGame';
import { Field, Level, Minesweeper } from '../types/types';

// Define a new type that extends the Minesweeper type to include gridClass
export type MinesweeperConfig = Minesweeper & { gridClass: string };

const SoundButton = withSound((props: React.ButtonHTMLAttributes<HTMLButtonElement> & WithSoundProps) => (
    <button {...props} />
));

const fields: Record<Level, Field> = {
    easy: {
        rows: 8,
        columns: 8,
        mines: 10,
    },
    medium: {
        rows: 16,
        columns: 16,
        mines: 40,
    },
    expert: {
        rows: 30,
        columns: 16,
        mines: 99,
    },
}

export const MainPage = () => {
    const [minesweeperConfig, setMinesweeperConfig] = useState<MinesweeperConfig | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null); //useRef
    
    const handleDifficultyClick = (level: Level) => {
        let playerName = null;
        
        do {
            playerName = window.prompt("Enter your name:");
        } while (!playerName);
        
        const url = `http://127.0.0.1:8000/game/create/${level}`;

        console.log("Fetching from url:", url);
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response not ok...');
            }
            return response.json();
        })
        .then((data: string) => {
            console.log('Response data:', data);

            const gameIdIndex = data.lastIndexOf(":") + 2;
            const gameId = data.substring(gameIdIndex);
            console.log("Extracted game ID:", gameId);

            const wsUrl = `ws://127.0.0.1:8000/game/connect/${gameId}`;
            const newWs = new WebSocket(wsUrl);
            
            (window as any).ws = newWs;

            newWs.onopen = () => {
                console.log("Websocket connection established!");
                setWs(newWs);
            };

            newWs.onmessage = (event) => {
                try {
                const message = JSON.parse(event.data);
                console.log("Received message from the server:", message);
                } catch (err) {
                    console.error(event.data);
                }
            };
            
            newWs.onerror = (error) => {
                console.log("Websocket error:", error);
            }

            newWs.onclose = () => {
                console.log("Websocket connection closed");
            };

            setMinesweeperConfig({
                ...fields[level],
                playerName,
                gameId,
                gridClass: `${level}-grid`,
            }); // Set the difficulty configuration
        })
        .catch(error => {
            console.log("Error:", error);
        })

        
    };

    // useEffect(() => {
    //     if (!ws) {
    //         return;
    //     }

    //     const sendCoordinates = (row: number, col: number) => {
    //         ws.send(JSON.stringify({row: row, col: col}));
    //     };

    //     (window as any).sendCoordinates = sendCoordinates;

    //     return () => {
    //         delete (window as any).sendCoordinates;
    //     }
    // }, [ws]);

    return (
        <>
            <SoundContainer />
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            
            { !minesweeperConfig && (
            <div className='choose-level'>
                <SoundButton className='level' onClick={() => handleDifficultyClick("easy")} soundType='click-sound'>Easy</SoundButton>
                <SoundButton className='level' onClick={() => handleDifficultyClick("medium")} soundType='click-sound'>Medium</SoundButton>
                <SoundButton className='level' onClick={() => handleDifficultyClick("expert")} soundType='click-sound'>Expert</SoundButton>
            </div>
            )}
            
            { minesweeperConfig !== null && <MinesweeperGame minesweeperConfig={minesweeperConfig} ws={ws} /> }
        </>
    );
};
