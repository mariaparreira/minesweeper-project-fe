import { useState, useEffect } from "react"
import { NumberDisplay } from "../number_display/NumberDisplay"

import './MinesweeperGame.css'
import { generateCells } from "../utils/utils";
import { GameBoard } from "./GameBoard";
import { Minesweeper } from "../types/types";
import { WithSoundProps, withSound } from "../sound/withSound";

const SoundEmoji = withSound((props: React.ButtonHTMLAttributes<HTMLDivElement> & WithSoundProps) => (
    <div {...props} />
));

export const MinesweeperGame = ({ minesweeperConfig }: { minesweeperConfig: Minesweeper & { gridClass: string } }) => {
    const { rows, columns, mines, gridClass } = minesweeperConfig;
    const [cells, setCells] = useState(generateCells(rows, columns, mines));
    // const [flaggedCount, setFlaggedCount] = useState(0);
    const [timer, setTimer] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [minesCounter, setMinesCounter] = useState<number>(mines);

    const startGame = () => {
        const intervalId = setInterval(() => {
            setTimer(prevTime => prevTime + 1);
        }, 1000);
        return intervalId;
    }

    useEffect(() => {
        setCells(generateCells(rows, columns, mines));
        setTimer(0);
        setLive(false);
        setMinesCounter(mines);
    }, [rows, columns, mines]);

    // const remainingMines = mines - flaggedCount;

    const restartGame = () => {
        setCells(generateCells(rows, columns, mines))
        setTimer(0);
        setLive(false);
        setMinesCounter(mines);
    }

    /** 
     * TODO: 
     *      Reveal a cell:
     *         * If it's a mine, reveal all mines and end game (stop time, set exploding sound, show 'Game Over' message).
     *         * If not, reveal it and all the adjacent, if applied.
     *         * Once all non-mine cells are revealed, you win (stop time, set fireworks sound, show 'Congratulations' message).
     *      For win, save time to be shown in a leaderboard.
     */

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (!live) {
            setLive(true);
            startGame();
        }
    }

    const handleCellContext = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
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
    };
        // const handleCellClick = (rowIndex: number, colIndex: number) => {
    //     const clickedCell = cells[rowIndex][colIndex];
    //     // If the clicked cell is a mine, end the game
    //     if (clickedCell.isMine) {
    //         // Handle game over logic here (e.g., display all mines, show game over message)
    //         // You might also want to stop the timer or trigger other end-game actions
    //         console.log('Game over! You clicked a mine.');
    //         return;
    //     }
        
    //     // If the clicked cell is not a mine, reveal it
    //     const newCells = cells.map((row, rIndex) =>
    //         row.map((cell, cIndex) =>
    //             rIndex === rowIndex && cIndex === colIndex
    //                 ? { ...cell, isRevealed: true } // Create a new cell with isRevealed set to true
    //                 : cell
    //         )
    //     );
    //     setCells(newCells);
    // };    

    return (
        <div className='minesweeper-board'>
            <div className='game-app'>
                <div className='game-header'>
                    <NumberDisplay value={minesCounter} />
                    <SoundEmoji className='emoji' onClick={restartGame} soundType='arcade-game'>🙃</SoundEmoji>
                    <NumberDisplay value={timer} />
                </div>
                <div className={`game-board ${gridClass}`}>
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
