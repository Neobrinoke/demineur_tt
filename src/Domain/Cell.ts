export type CellStatus = 'untouched' | 'flagged' | 'dug' | 'detonated';
export type CellAction = 'dig' | 'flag';

export class Cell {
    public index: number;
    public adjCells: Array<Cell>;
    public bomb: boolean;
    public flagged: boolean;
    public dug: boolean;
    public minesCount: number;

    static withBomb(): Cell {
        return new Cell(true, false, false, 0);
    }

    static withoutBomb(): Cell {
        return new Cell(false, false, false, 0);
    }

    constructor(withBomb: boolean, flagged: boolean, dug: boolean, minesCount: number) {
        this.index = 0;
        this.adjCells = [];
        this.bomb = withBomb;
        this.flagged = flagged;
        this.dug = dug;
        this.minesCount = minesCount;
    }

    flag(): Cell {
        if (this.dug) {
            throw new Error('This cell has already been dug');
        }

        this.flagged = !this.flagged;

        return this;
    }

    dig(propagation: boolean = true): Cell {
        this.flagged = false;
        this.dug = true;

        if (propagation) {
            this.adjCells.forEach((cell: Cell) => {
                if (!cell.bomb && !cell.dug) {
                    cell.dig(cell.minesCount === 0);
                }
            });
        }

        return this;
    }

    get style(): object {
        const bgColor = () => {
            let odd = this.index % 2 === 0;
            switch (this.status) {
                case "detonated":
                    return 'black';
                case "dug":
                    return odd ? '#F9E79F' : '#F7DC6F';
                case "flagged":
                default:
                    return odd ? '#A9CCE3' : '#7FB3D5';
            }
        };

        const borderTop = () => {

        };

        const borderRight = () => {

        };

        const borderBottom = () => {

        };

        const borderLeft = () => {

        };


        return {
            width: '40px',
            height: '40px',
            textAlign: 'center',
            lineHeight: '40px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            borderTop: borderTop(),
            borderRight: borderRight(),
            borderBottom: borderBottom(),
            borderLeft: borderLeft(),
            backgroundColor: bgColor(),
        };
    }

    get detonated(): boolean {
        return this.bomb && this.dug;
    }

    get status(): CellStatus {
        if (this.detonated) {
            return 'detonated';
        }
        if (this.dug) {
            return 'dug';
        }
        if (this.flagged) {
            return 'flagged';
        }
        return 'untouched';
    }
}
