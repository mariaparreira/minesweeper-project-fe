import { useState, useEffect, useRef } from "react";
import { NumberDisplay } from "../number_display/NumberDisplay";
import './MinesweeperGame.css';
import { GameBoard } from "./GameBoard";
import { Face, MinesweeperGameProps } from "../types/types";
import { WithSoundProps, withSound } from "../sound/withSound";

const SoundEmoji = withSound((props: React.ButtonHTMLAttributes<HTMLDivElement> & WithSoundProps) => (
    <div {...props} />
));

export const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ 
        minesweeperConfig, 
        board, 
        timer,
        gameOver, 
        gameWon, 
        onCellClick, 
        onCellContext 
    }) => {
        
    const { mines, gridClass } = minesweeperConfig;
    const [face, setFace] = useState<Face>(Face.smile);
    const [flagsCounter, setFlagsCounter] = useState<number>(0);
    const [currentBoard, setCurrentBoard] = useState(board);

    const gameBoardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseDown = () => {
            setFace(Face.wow);
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
        if (gameWon) {
            setFace(Face.won);
        } else if (gameOver) {
            setFace(Face.lost);
        }
    }, [gameOver, gameWon]);

    const handleRestartGame = () => {
        window.location.reload();
    };

    const handleCellClick = (row: number, col: number) => {    
        onCellClick(row, col);
    };

    const handleCellContext = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();

        
        const cell = currentBoard[row][col];
        if (!cell.isRevealed) {
            const newBoard = [...currentBoard];
            const currentCell = newBoard[row][col];
    
            if (!currentCell.isFlagged && flagsCounter < mines) { // Check if the number of flags placed is less than the number of mines
                newBoard[row][col] = { ...currentCell, isFlagged: true };
                setFlagsCounter(prevFlags => prevFlags + 1); // Increment the flags counter
            } else if (currentCell.isFlagged) {
                newBoard[row][col] = { ...currentCell, isFlagged: false };
                setFlagsCounter(prevFlags => prevFlags - 1); // Decrement the flags counter
            }
            setCurrentBoard(newBoard);
        }
        onCellContext(row, col);
    };    

    return (
        <div className='minesweeper-board'>
            <div className='game-app'>
                <div className='game-header'>
                    <NumberDisplay value={mines - flagsCounter} />
                    <SoundEmoji className='emoji' onClick={handleRestartGame} soundType='arcade-game'>{face}</SoundEmoji>
                    <NumberDisplay value={timer} />
                </div>
                <div ref={gameBoardRef} className={`game-board ${gridClass}`}>
                    {board.map((row, rowIndex) => 
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
    );
};
