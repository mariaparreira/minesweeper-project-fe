import { Cell } from "../types/types";

export const generateCells = (rows: number, cols: number, mines: number): Cell[][] => {
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

    // Randomly place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const currentCell = cells[row][col]
        if (!currentCell.isMine) {
            currentCell.isMine = true;
            minesPlaced++;
        }
    }

    // Calculate the numbers for each cell
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            const currentCell = cells[rowIndex][colIndex]
            if (!currentCell.isMine) {
                for (let i = -1; i <= 1; i++)  {
                    for (let j = -1; j <= 1; j++) {
                        const row = rowIndex + i;
                        const col = colIndex + j;

                        if (row >= 0 && row < rows && col >= 0 && col < cols) {
                            if (cells[row][col].isMine) {
                                currentCell.adjacentMines++;
                            }
                        }
                    }
                }
            }
        }
    }

    return cells;
}
