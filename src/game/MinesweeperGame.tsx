import { useState, useEffect, useRef } from "react"
import { NumberDisplay } from "../number_display/NumberDisplay"

import './MinesweeperGame.css'
import { generateCells, revealAdjacentCells } from "../utils/utils";
import { GameBoard } from "./GameBoard";
import { Cell, Face, /*Minesweeper,*/ MinesweeperGameProps } from "../types/types";
import { WithSoundProps, withSound } from "../sound/withSound";

const SoundEmoji = withSound((props: React.ButtonHTMLAttributes<HTMLDivElement> & WithSoundProps) => (
    <div {...props} />
));

export const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ minesweeperConfig, onCellClick, onCellContext }) => {
    const { rows, columns, mines, gridClass } = minesweeperConfig;
    const [cells, setCells] = useState(generateCells(rows, columns, mines));
    const [face, setFace] = useState<Face>(Face.smile);
    const [timer, setTimer] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [minesCounter, setMinesCounter] = useState<number>(mines);
    const [isLost, setIsLost] = useState<boolean>(false);
    const [isWon, setIsWon] = useState<boolean>(false);

    const gameBoardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseDown = () => {
            setFace(Face.upsideDownSmile);
        };

        const handleMouseUp = () => {
            setFace(Face.smile);
        }

        const gameBoardElement = gameBoardRef.current;
        if (gameBoardElement) {
            gameBoardElement.addEventListener("mousedown", handleMouseDown);
            gameBoardElement.addEventListener("mouseup", handleMouseUp);

            return () => {
                gameBoardElement.removeEventListener("mousedown", handleMouseDown);
                gameBoardElement.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, []);
    
    useEffect(() => {
        setCells(generateCells(rows, columns, mines));
        setTimer(0);
        setLive(false);
        setMinesCounter(mines);
    }, [rows, columns, mines]);

    
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
    
    useEffect(() => {
        if (isLost) {
            setLive(false);
            setFace(Face.lost);
            
        }
    }, [isLost]);
    
    useEffect(() => {
        if (isWon) {
            setLive(false);
            setFace(Face.won);
        }
    }, [isWon]);

    // Handles the action of restarting the game
    const handleRestartGame = () => {
        setLive(false);
        setTimer(0);
        setCells(generateCells(rows, columns, mines))
        setMinesCounter(mines);
        setIsLost(false);
        setIsWon(false);
        setFace(Face.smile);
    }
    
    /** 
     * TODO: 
     *      Reveal a cell:
     *         * If it's a mine, reveal all mines and end game (stop time, set exploding sound, show 'Game Over' message).
     *         * If not, reveal it and all the adjacent, if applied.
     *         * Once all non-mine cells are revealed, you win (stop time, set fireworks sound, show 'Congratulations' message).
     *      For win, save time to be shown in a leaderboard.
     */

    // Handles when a player reveals a cell
    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (isLost || isWon) return;

        let newCells = cells.slice();
        
        if (!live) {
            // Make sure you don't click on a mine in the beggining
            let isAMine = newCells[rowIndex][colIndex].isMine;
            
            while (isAMine) {
                newCells = generateCells(rows, columns, mines);

                if (!newCells[rowIndex][colIndex].isMine) {
                    isAMine = false;
                    break;
                }
            }
            setLive(true);
        }
        
        const currentCell = newCells[rowIndex][colIndex];
        
        if (currentCell.isFlagged || currentCell.isRevealed) {
            return;
        }
        
        if (currentCell.isMine) {
            // TODO: handle game over logic here
            // Game over => explosion sound
            setIsLost(true);
            newCells = showAllMines() // Displays all mines
            setCells(newCells);
            return;
        }
        
        newCells = revealAdjacentCells(newCells, rowIndex, colIndex); // Reveals numbers and if empty, reveals adjacent cells as well
        
        console.log(`Clicked on ${rowIndex} and ${colIndex}`);

        
        // Check if won
        let safeCells = false;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const currentCell = newCells[row][col];
                
                if (!currentCell.isMine && !currentCell.isRevealed) {
                    safeCells = true;
                    break;
                }
            }
        }
        
        if (!safeCells) {
            newCells = newCells.map(row => 
                row.map(cell => {
                    if (cell.isMine) {
                        return {
                            ...cell,
                            isFlagged: true,
                        };
                    }
                    return cell;
                })
            );
            setIsWon(true);
        }
        setCells(newCells);
        
        onCellClick(rowIndex, colIndex); // When a cell is clicked, it calls the function with coordinates
    }

    // Handles the flags, for the mine counter (decreasing and increasing)
    const handleCellContext = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        if (isLost || isWon) return;

        e.preventDefault();
        const cell = cells[rowIndex][colIndex];
        if (!cell.isRevealed) {
            const newCells = [...cells];
            const currentCell = newCells[rowIndex][colIndex];
    
            if (!currentCell.isFlagged && minesCounter > 0) {
                newCells[rowIndex][colIndex] = { ...currentCell, isFlagged: true };
                setMinesCounter(prevMines => prevMines - 1); // Decrease mine count
            } else if (currentCell.isFlagged) {
                newCells[rowIndex][colIndex] = { ...currentCell, isFlagged: false };
                setMinesCounter(prevMines => prevMines + 1); // Increase mine count
            }
    
            setCells(newCells);
        }
        onCellContext(rowIndex, colIndex);
    };

    const showAllMines = (): Cell[][] => {
        const currentCell = cells.map(row => row.slice());
        return currentCell.map(row => 
            row.map(cell => {
                if (cell.isMine) {
                    return {
                        ...cell,
                        isRevealed: true,
                    };
                }
                return cell;
            })
        );
    };

    return (
        <div className='minesweeper-board'>
            <div className='game-app'>
                <div className='game-header'>
                    <NumberDisplay value={minesCounter} />
                    <SoundEmoji className='emoji' onClick={handleRestartGame} soundType='arcade-game'>{face}</SoundEmoji>
                    <NumberDisplay value={timer} />
                </div>
                <div ref={gameBoardRef} className={`game-board ${gridClass}`}>
                    {cells.map((row, rowIndex) => 
                        row.map((cell, colIndex) =>
                            <GameBoard 
                                key={`${rowIndex}-${colIndex}`}
                                cell={cell}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                onContext={(e) => handleCellContext(e, rowIndex, colIndex)}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
