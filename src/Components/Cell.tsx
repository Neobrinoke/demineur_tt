import React from 'react';
import { Cell as CellClass } from '../Domain/Cell';

type CellProps = {
    cell: CellClass;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const cellStyle = (cell: CellClass): React.CSSProperties => (cell.style);

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.cell)}
        >
            {props.cell.status === 'dug' && props.cell.minesCount > 0 ? props.cell.minesCount : emojis[props.cell.status]}
        </div>
    );
};
