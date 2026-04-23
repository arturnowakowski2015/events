import type { ReactNode } from 'react';

type ApiPanelProps = {
    title: string;
    description: string;
    badge: string;
    wide?: boolean;
    children: ReactNode;
};

export function ApiPanel({ title, description, badge, wide = false, children }: ApiPanelProps) {
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