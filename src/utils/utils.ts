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
                for (let i = -1; i <= 1; i++) {
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
};

export const revealAdjacentCells = (cells: Cell[][], rowIndex: number, colIndex: number): Cell[][] => {
    // Define a function to reveal adjacent cells recursively
    const reveal = (row: number, col: number): void => {
        // If the current cell is already revealed or is a mine, stop recursion
        if (cells[row][col].isRevealed || cells[row][col].isMine) {
            return;
        }

        // Reveal the current cell
        cells[row][col].isRevealed = true;

        // If the current cell has no adjacent mines, recursively reveal its neighbors
        if (cells[row][col].adjacentMines === 0) {
            // Define offsets for adjacent cells
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], /* [0, 0], */ [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];

            // Iterate through all directions
            for (const [dx, dy] of directions) {
                const newRow = row + dx;
                const newCol = col + dy;

                // Check if the new position is within the bounds of the grid
                if (newRow >= 0 && newRow < cells.length && newCol >= 0 && newCol < cells[0].length) {
                    reveal(newRow, newCol); // Recursively reveal adjacent cell
                }
            }
        }
    };

    // Start revealing adjacent cells from the specified cell indices
    reveal(rowIndex, colIndex);

    return cells;
};

