import {Cell, CellAction} from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;

    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            let cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;

            cells[rand].index = rand;
            cells[index].index = index;
        }

        let topIds: Array<number> = [];
        for (let topId: number = 0; topIds.length !== column; topId++) {
            topIds.push(topId);
        }

        let leftIds: Array<number> = [];
        for (let leftId: number = 0; leftIds.length !== row; leftId += column) {
            leftIds.push(leftId);
        }

        let rightIds: Array<number> = [];
        for (let rightId: number = column - 1; rightIds.length !== row; rightId += column) {
            rightIds.push(rightId);
        }

        let bottomIds: Array<number> = [];
        for (let bottomId: number = length - 1; bottomIds.length !== column; bottomId--) {
            bottomIds.push(bottomId);
        }

        cells = cells.map((cell: Cell) => {
            if (!cell.bomb) {
                if (!topIds.includes(cell.index) && cells[cell.index - column]) {
                    cell.adjCells.push(cells[cell.index - column]);
                }

                if (!leftIds.includes(cell.index) && cells[cell.index - 1]) {
                    cell.adjCells.push(cells[cell.index - 1]);
                }

                if (!rightIds.includes(cell.index) && cells[cell.index + 1]) {
                    cell.adjCells.push(cells[cell.index + 1]);
                }

                if (!bottomIds.includes(cell.index) && cells[cell.index + column]) {
                    cell.adjCells.push(cells[cell.index + column]);
                }

                cell.adjCells.forEach((adjCell: Cell) => {
                    if (adjCell.bomb) {
                        cell.minesCount += 1;
                    }
                });
            }

            return cell;
        });

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError('cell count must be dividable by column count');
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(callbackfn: (value: Cell, index: number, array: Cell[]) => {}, thisArg?: any) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }
}
