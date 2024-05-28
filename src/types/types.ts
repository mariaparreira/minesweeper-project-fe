import { MinesweeperConfig } from "../game/MainPage";

export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

export enum Face {
    explodingHead = "🤯",
    smile = "🙂",
    won = "🥳",
    lost = "🥺"
}

export type Level = "easy" | "medium" | "expert";

export type Field = {
    rows: number;
    columns: number;
    mines: number;
};

export type Minesweeper = Field & {
    gameId: string;
    playerName: string;
}


export type NumberDisplayType = {
    value: number;
}

export interface MinesweeperGameProps {
    minesweeperConfig: MinesweeperConfig;
    board: Cell[][];
    timer: number;
    gameOver: boolean;
    gameWon: boolean;
    onCellClick : (row: number, col: number) => void;
    onCellContext: (row: number, col: number) => void;
}

export interface GameBoardProps {
    cell: Cell;
    onClick: () => void;
    onContext: (e: React.MouseEvent) => void;
}

export type LeaderboardEntry = {
    playerName: string;
    time: number
}

export type LeaderboardProps = {
    data: LeaderboardEntry[];
    onClose: () => void;
}
