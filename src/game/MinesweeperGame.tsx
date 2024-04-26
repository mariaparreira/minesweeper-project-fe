import { useState, useEffect } from "react"
import { NumberDisplay } from "../number_display/NumberDisplay"

import './MinesweeperGame.css'
import { generateCells } from "../utils/utils";
import { GameBoard } from "./GameBoard";
import { Minesweeper } from "../types/types";

export const MinesweeperGame = ({ minesweeperConfig }: { minesweeperConfig: Minesweeper & { gridClass: string } }) => {
    const { rows, columns, mines, gridClass } = minesweeperConfig;
    const [cells, setCells] = useState(generateCells(rows, columns, mines));
    const [flaggedCount, setFlaggedCount] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        setCells(generateCells(rows, columns, mines));
        setFlaggedCount(0);
        setTimer(0);

        const intervalId = setInterval(() => {
            setTimer(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [rows, columns, mines]);

    const handleFlaggedCountChange = (increment: number) => {
        setFlaggedCount(prevCount => prevCount + increment);
    };

    const remainingMines = mines - flaggedCount;

    const restartGame = () => {
        setCells(generateCells(rows, columns, mines))
        setFlaggedCount(0);
        setTimer(0);
    }

    return (
        <div className='minesweeper-board'>
            <div className='game-app'>
                <div className='game-header'>
                    <NumberDisplay value={remainingMines} />
                    <div className='emoji' onClick={restartGame}>🙃</div>
                    <NumberDisplay value={timer} />
                </div>
                <div className={`game-board ${gridClass}`}>
                    {cells.map((row, rowIndex) => 
                        row.map((_, colIndex) =>
                            <GameBoard key={`${rowIndex}-${colIndex}`} onFlaggedCountChange={handleFlaggedCountChange} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
