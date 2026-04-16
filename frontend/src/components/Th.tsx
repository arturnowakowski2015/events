import React from 'react';

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

const style: React.CSSProperties = {
    background: '#1e293b',
    color: '#f8fafc',
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '2px solid #334155',
};

export function Th({ children, style: overrideStyle, ...rest }: ThProps) {
    return (
        <th style={{ ...style, ...overrideStyle }} {...rest}>
            {children}
        </th>
    );
}
