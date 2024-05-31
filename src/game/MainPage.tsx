import React, { useEffect, useRef, useState } from 'react';
import { withSound, WithSoundProps } from '../sound/withSound';
import { SoundContainer } from '../sound/SoundContainer';
import './MainPage.css';
import '../styles.css';
import { MinesweeperGame } from './MinesweeperGame';
import { Cell, Field, LeaderboardEntry, Level, Minesweeper } from '../types/types';
import { generateCells } from '../utils/utils';

import { Leaderboard } from './Leaderboard';

import winGame from "../sound/win/clapping.wav";
import loseGame from "../sound/lose/explosion.wav";
import fallCells from "../sound/lose/falling-cells.mp3";

import Confetti from "react-confetti";


// Define a new type that extends the Minesweeper type to include gridClass
export type MinesweeperConfig = Minesweeper & { gridClass: string };

export const SoundButton = withSound((props: React.ButtonHTMLAttributes<HTMLButtonElement> & WithSoundProps) => (
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
    const [board, setBoard] = useState<Cell[][]>([]);
    const [timer, setTimer] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<Level>("easy");

    const [clappingAudio] = useState(new Audio(winGame));
    const [explodingAudio] = useState(new Audio(loseGame));
    const [fallingAudio] = useState(new Audio(fallCells));
    
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        clappingAudio.load();
        explodingAudio.load();
        fallingAudio.load();
    }, [clappingAudio, explodingAudio, fallingAudio]);

    useEffect(() => {
        if (live && timer < 999) {
            const time = setInterval(() => {
                setTimer(timer + 1);
            }, 1000);
            
            return () => {
                clearInterval(time);
            };
        }
    }, [live, timer]);
    
    const handleDifficultyClick = (level: Level) => {
        let playerName = null;
        const nameRegex = /^[a-zA-Z]{3,}$/;
        
        do {
            playerName = window.prompt("Enter your name:");
        } while (!playerName || !nameRegex.test(playerName));
        
        const url = `http://127.0.0.1:8000/game/create/${level}`;
        
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
            return response.text();
        })
        .then((data: string) => {
            const json= JSON.parse(data);
            const { gameId } = json;

            const ws = new WebSocket(`ws://127.0.0.1:8000/game/connect/${gameId}?playerName=${encodeURIComponent(playerName)}`);

            ws.onopen = () => {
                // console.log("Websocket connection established!");
                wsRef.current = ws;
            };

            ws.onmessage = (event) => {
                try {
                const message = JSON.parse(event.data);

                if (message.board) {
                    setBoard(message.board);
                }

                } catch (err) {
                    console.error(event.data);
                }
            };
            
            // ws.onerror = (error) => {
            //     console.log("Websocket error:", error);
            // }

            // ws.onclose = () => {
            //     console.log("Websocket connection closed");
            // };

            setBoard(generateCells(fields[level].rows, fields[level].columns));
            setMinesweeperConfig({
                ...fields[level],
                playerName,
                gameId,
                gridClass: `${level}-grid`,
            }); // Set the difficulty configuration
            setTimer(0);
            setLive(false);
            setGameOver(false);
            setGameWon(false);

            setLive(true);
        })
        .catch(error => {
            console.error("Error:", error);
        })
    };

    // Handles websocket messages
    const handleCellClick = (row: number, col: number) => {
        if (!wsRef.current || gameOver || gameWon) return;

        if (!live) {
            setLive(true);
        }

        const cell = board[row][col];

        // Check if it's flagged or revealed
        if (cell.isFlagged || cell.isRevealed) return; // Does nothing

        // Check for losing outcome
        if (cell.isMine) {
            const updatedBoard = board.map(row => 
                row.map(cell => ({
                    ...cell,
                    isRevealed: true,
                    isFalling: true,
                }))
            );
            setBoard(updatedBoard);
            setGameOver(true);
            setLive(false);
            wsRef.current?.close();

            explodingAudio.play();
            fallingAudio.play();
        } else {
            let updatedBoard = [...board];
            // Check for winning outcome
            updatedBoard[row][col].isRevealed = true;
            setBoard(updatedBoard);

            let allNonMineRevealed = true;
            updatedBoard.forEach(row => {
                row.forEach(cell => {
                    if (!cell.isMine && !cell.isRevealed) {
                        allNonMineRevealed = false;
                    }
                });
            });

            if (allNonMineRevealed) {
                setGameWon(true);
                setLive(false);
                
                clappingAudio.play();
            }
        }

        // Send coordinates via WebSocket with action: reveal
        wsRef.current.send(JSON.stringify({ row, col, action: "reveal" }));
    };

    const handleCellContext = (row: number, col: number) => {
        if (wsRef.current && !gameOver && !gameWon) {
            // Send coordinates via WebSocket with action: flag
            wsRef.current.send(JSON.stringify({ row, col, action: "flag" }));
        }
    };

    const handleLeaderboard = () => {
        setShowLeaderboard(!showLeaderboard);
        if (!showLeaderboard) {
            fetchLeaderboardData(selectedLevel);
        }
    }

    const fetchLeaderboardData = (level: Level) => {
        const url = `http://127.0.0.1:8000/game/leaderBoard/${level}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok...");
            }
            return response.json();
        })
        .then((data: [string, number][]) => {
            const formattedData = data.map(entry => ({
                playerName: entry[0],
                time: entry[1],
            }));
            setLeaderboardData(formattedData);
            // setShowLeaderboard(true);
        })
        .catch(err => console.error("Error fetching leaderboard:", err));
    }

    const handleLevelChange = (level: Level) => {
        setSelectedLevel(level);
        fetchLeaderboardData(level);
    }

    return (
        <>
            <SoundContainer />
            { gameWon && <Confetti />}
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            
            { !minesweeperConfig && (
                <>
                    <div className="choose-level">
                        <SoundButton className="level" onClick={() => handleDifficultyClick("easy")} soundType="click-sound">Easy</SoundButton>
                        <SoundButton className="level" onClick={() => handleDifficultyClick("medium")} soundType="click-sound">Medium</SoundButton>
                        <SoundButton className="level" onClick={() => handleDifficultyClick("expert")} soundType="click-sound">Expert</SoundButton>
                    </div>
                    <div className="lb-table">
                        <SoundButton className="level ranking" onClick={handleLeaderboard} soundType="click-sound">Leaderboard</SoundButton>
                    </div>
                </>
            )}

            
            { minesweeperConfig && 
                <MinesweeperGame 
                    minesweeperConfig={minesweeperConfig} 
                    board={board}
                    timer={timer}
                    gameOver={gameOver}
                    gameWon={gameWon}
                    onCellClick={handleCellClick} 
                    onCellContext={handleCellContext} 
                /> 
            }

            { showLeaderboard && 
                <Leaderboard 
                    data={leaderboardData}
                    level={selectedLevel}
                    onLevelChange={handleLevelChange}
                    onClose={handleLeaderboard} 
                />
            }
        </>
    );
};
