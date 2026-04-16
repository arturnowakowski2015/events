import React from 'react';

interface RowCheckboxProps {
    checked: boolean;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
}

export function RowCheckbox({ checked, indeterminate = false, onChange, ariaLabel }: RowCheckboxProps) {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            aria-label={ariaLabel ?? 'Select row'}
            onChange={(e) => onChange(e.target.checked)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
        />
    );
}
