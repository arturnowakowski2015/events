import React from 'react';
import { Th } from './Th';
import { Td } from './Td';
import { RowCheckbox } from './RowCheckbox';
import { useMemo } from "react";

export interface ColumnDef<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
    num: number;
    columns: ColumnDef<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    selectedKeys?: Set<string>;
    onSelectionChange?: (selectedKeys: Set<string>) => void;
}

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
};

const checkboxThStyle: React.CSSProperties = { width: '40px', textAlign: 'center' };
const checkboxTdStyle: React.CSSProperties = { textAlign: 'center' };

export function GenericTable<T>({
    num,
    columns,
    data,
    keyExtractor,
    selectedKeys: controlledSelected,
    onSelectionChange,

}: GenericTableProps<T>) {
    console.log('GenericTable render');
    const [internalSelected, setInternalSelected] = React.useState<Set<string>>(new Set());

    const selected = controlledSelected ?? internalSelected;

    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

    const setSelected = (next: Set<string>) => {
        if (!controlledSelected) setInternalSelected(next);
        onSelectionChange?.(next);
    };

    const allKeys = safeData.map(keyExtractor);
    const allChecked = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
    const someChecked = !allChecked && allKeys.some((k) => selected.has(k));

    const toggleAll = (checked: boolean) => {
        setSelected(checked ? new Set(allKeys) : new Set());
    };

    const toggleRow = (key: string, checked: boolean) => {
        const next = new Set(selected);
        if (checked) next.add(key);
        else next.delete(key);
        setSelected(next);
    };
    const [v, setV] = React.useState(0);

    const squared = useMemo(() => {
        const value = num * num;
        console.log('Recalculating squared:', value);
        return value;
    }, [v]);
    return (
        <div style={{ overflowX: 'auto' }} onClick={() => setV(v => v + 1)}>s{squared}  v{v}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <Th style={checkboxThStyle}>{num}
                            <RowCheckbox
                                checked={allChecked}
                                indeterminate={someChecked}
                                onChange={toggleAll}
                                ariaLabel="Select all rows"
                            />
                        </Th>
                        {columns.map((col) => (
                            <Th key={col.header}>{col.header}</Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {safeData.length === 0 ? (
                        <tr>
                            <Td colSpan={columns.length + 1} style={{ textAlign: 'center', color: '#888' }}>
                                No data
                            </Td>
                        </tr>
                    ) : (
                        safeData.map((row) => {
                            const key = keyExtractor(row);
                            const isChecked = selected.has(key);
                            return (
                                <tr key={key} style={isChecked ? { background: '#f0f9ff' } : undefined}>
                                    <Td style={checkboxTdStyle}>
                                        <RowCheckbox
                                            checked={isChecked}
                                            onChange={(checked) => toggleRow(key, checked)}
                                            ariaLabel={`Select row ${key}`}
                                        />
                                    </Td>
                                    {columns.map((col) => (
                                        <Td key={col.header}>{col.accessor(row)}</Td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
