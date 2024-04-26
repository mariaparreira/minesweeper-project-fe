export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

export type Minesweeper = {
    rows: number;
    columns: number;
    mines: number;
}

export type NumberDisplayType = {
    value: number;
}

export interface GameBoardProps {
    onFlaggedCountChange: (increment: number) => void;
}
