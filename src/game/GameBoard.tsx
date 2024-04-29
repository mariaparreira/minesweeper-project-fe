import React from "react";
import "./GameBoard.css";
import { GameBoardProps } from "../types/types";

export const GameBoard: React.FC<GameBoardProps> = ({ cell }) => {
    const renderContent = (): React.ReactNode => {

        // If cell is revealed and is a mine
        if (cell.isRevealed && cell.isMine) {
            return ( 
                <span role="img" aria-label="mine">💣</span>
            );
        } 
        
        // If cell is revealed and has adjecent mines
        else if (cell.isRevealed && cell.adjacentMines > 0) {
            return (
                <span className={`adjacent-${cell.adjacentMines}`}>{cell.adjacentMines}</span>
            );
        } 
        
        // If cell is a flag
        else if (cell.isFlagged) {
            return ( 
                <span role="img" aria-label="flag">🚩</span>
            );
        } 

        return null;
    }
    return (
        <div className={`board ${cell.isRevealed ? "revealed" : ""}`}>
            {renderContent()}
        </div>
    );
};
