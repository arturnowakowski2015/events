import { useState, createContext, useContext, type ReactNode } from 'react';

// Interfejs dla stanu wewnątrz kontekstu
interface SelectContextProps<T> {
    selectedValue: T;
    updateValue: (value: T) => void;
}

export const SelectContext = createContext<SelectContextProps<any> | undefined>(undefined);

interface SelectProps<T> {
    children: ReactNode;
    defaultValue: T;
    onChange?: (value: T) => void;
}

export function Select<T>({ children, defaultValue, onChange }: SelectProps<T>) {
    const [selectedValue, setSelectedValue] = useState<T>(defaultValue);

    const updateValue = (value: T) => {
        setSelectedValue(value);
        onChange?.(value);
    };

    return (
        <SelectContext.Provider value={{ selectedValue, updateValue }}>
            <div className="select-container" style={{ border: '1px solid #ccc', padding: '10px' }}>
                {children}
            </div>
        </SelectContext.Provider>
    );
}