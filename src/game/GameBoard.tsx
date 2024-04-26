import React from "react"

import './GameBoard.css'
import { GameBoardProps } from "../types/types"

export const GameBoard: React.FC<GameBoardProps> = ({ onFlaggedCountChange }) => {
    return <div className='board' />
}