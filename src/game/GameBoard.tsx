import React from "react";
import "./GameBoard.css";
import { GameBoardProps } from "../types/types";

export const GameBoard: React.FC<GameBoardProps> = ({ cell, onClick, onContext }) => {
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

    // Generate random falling duration and delay
    const fallingDuration = `${Math.random() * 3 + 2}s`;
    const fallingDelay = `${Math.random() * 2}s`;

    return (
        <div 
            className={`board ${cell.isRevealed ? "revealed" : ""} ${cell.isFalling ? "falling" : ""}`} 
            onClick={onClick} 
            onContextMenu={onContext}
            style={{ 
                animationDuration: cell.isFalling ? fallingDuration: '0s',
                animationDelay: cell.isFalling ? fallingDelay: '0s',
            }}
        >
            {renderContent()}
        </div>
    );
};
