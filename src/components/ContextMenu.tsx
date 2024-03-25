import { Dispatch } from 'react';
import { ballColors } from '../objects/ball';

export type ContextMenuProps = {
    x: number;
    y: number;
    selected: string;
    setSelected: Dispatch<ContextMenuProps['selected']>;
};

export default function ContextMenu({ x, y, selected, setSelected }: ContextMenuProps) {
    return (
        <ul
            id="context-menu"
            style={{
                left: x,
                top: y,
            }}
        >
            {ballColors.map((c) => (
                <li key={c}>
                    <label style={{ background: c }}>
                        <input
                            type="radio"
                            name="colors"
                            value={c}
                            className={`${c === selected ? 'selected' : ''}`}
                            onChange={() => {
                                setSelected(c);
                            }}
                            defaultChecked={c === selected}
                        />
                    </label>
                </li>
            ))}
        </ul>
    );
}
