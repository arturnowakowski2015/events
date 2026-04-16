import React from 'react';

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

const style: React.CSSProperties = {
    padding: '9px 14px',
    borderBottom: '1px solid #e2e8f0',
    verticalAlign: 'top',
};

export function Td({ children, ...rest }: TdProps) {
    return (
        <td style={{ ...style, ...(rest.style ?? {}) }} {...rest}>
            {children}
        </td>
    );
}
