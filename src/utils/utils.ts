import { Cell } from "../types/types";

export const generateCells = (rows: number, cols: number): Cell[][] => {
    const cells: Cell[][] = [];

    // Generating all cells
    for (let row = 0; row < rows; row++) {
        cells.push([]);
        for (let col = 0; col < cols; col++) {
            cells[row].push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            });
        }
    }

    return cells;
};
