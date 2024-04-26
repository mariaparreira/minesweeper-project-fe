import React, { useState } from "react"
import { NumberDisplay } from "../number_display/NumberDisplay"

import './MinesweeperGame.css'
import { generateCells } from "../utils/utils";
import { GameBoard } from "./GameBoard";

export const MinesweeperGame = () => {
    const [cells, setCells] = useState(generateCells());
    
    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
            row.map((col, colIndex) =>
                <GameBoard />
            )
        )
    }

    return (
        <div className='minesweeper-board'>
            <div className='game-app'>
                <div className='game-header'>
                    <NumberDisplay value={10} />
                    <div className='emoji'>🙃</div>
                    <NumberDisplay value={0} />
                </div>
                <div className='game-board'>{renderCells()}</div>
            </div>
        </div>
    )
}
