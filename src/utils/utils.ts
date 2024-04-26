import { Cell } from "../types/types";

export const generateCells = (rows: number, cols: number, mines: number): Cell[][] => {
    const cells: Cell[][] = [];

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

    // Randomly place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!cells[row][col].isMine) {
            cells[row][col].isMine = true;
            minesPlaced++;
        }
    }

    return cells;
}
