import React, { useState, createContext, useContext, type ReactNode } from 'react';
import { SelectContext } from "./Select"

interface OptionProps<T> {
    value: T;
    children: ReactNode;
}

export function Option<T>({ value, children }: OptionProps<T>) {
    // Wyciągamy dane z kontekstu i rzutujemy na odpowiedni typ T
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error("Komponent <Option> musi być użyty wewnątrz <Select>");
    }

    const { selectedValue, updateValue } = context;
    const isSelected = selectedValue === value;

    return (
        <div
            onClick={() => updateValue(value)}
            style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#007bff' : 'transparent',
                color: isSelected ? 'white' : 'black',
                borderRadius: '4px'
            }}
        >
            {children} {isSelected && '✓'}
        </div>
    );
}
