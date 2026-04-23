import type { ReactNode } from 'react';

type CrudPanelProps = {
    title: string;
    description: string;
    badge: string;
    wide?: boolean;
    children: ReactNode;
};

export function CrudPanel({ title, description, badge, wide = false, children }: CrudPanelProps) {
    return (
        <section className={wide ? 'crud-panel crud-panel--wide' : 'crud-panel'}>
            <div className="crud-panel__header">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                <span className="crud-endpoint">{badge}</span>
            </div>
            {children}
        </section>
    );
}