import type { ReactNode } from 'react';

type ApiPanelMenuRootProps = {
    children: ReactNode;
};

type ApiPanelMenuItemProps = {
    children: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function ApiPanelMenuRoot({ children }: ApiPanelMenuRootProps) {
    return (
        <nav className="crud-menu">
            {children}
        </nav>
    );
}

function ApiPanelMenuItem({ children, checked, onChange }: ApiPanelMenuItemProps) {
    return (
        <label className="crud-menu-item">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span>{children}</span>
        </label>
    );
}

export const ApiPanelMenu = Object.assign(ApiPanelMenuRoot, {
    Item: ApiPanelMenuItem,
});
