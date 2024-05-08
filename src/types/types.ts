import { MinesweeperConfig } from "../game/MainPage";

export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

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
    ws: WebSocket | null;
}

export interface GameBoardProps {
    cell: Cell;
    onClick: () => void;
    onContext: (e: React.MouseEvent) => void;
}
