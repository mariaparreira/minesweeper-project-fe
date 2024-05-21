import { MinesweeperConfig } from "../game/MainPage";

export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

// export type Cell2 = "unrevealed" | "flag" | "empty" | "mine" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export enum Face {
    upsideDownSmile = "🙃",
    smile = "🙂",
    won = "🥳",
    lost = "🥺"
}

export type Level = "easy" | "medium" | "expert";

export type Field = {
    rows: number;
    columns: number;
    // cells: Cell2[][];
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
    onCellClick : (rowIndex: number, colIndex: number) => void
    onCellContext: (row: number, col: number) => void;
}

export interface GameBoardProps {
    cell: Cell;
    onClick: () => void;
    onContext: (e: React.MouseEvent) => void;
}
