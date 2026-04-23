import type { FormEvent, ReactNode } from 'react';

type IncidentMetricsRootProps = {
    children: ReactNode;
};

type IncidentMetricsItemProps = {
    children: ReactNode;
};

type IncidentMetricsValueProps = {
    children: ReactNode;
};

type IncidentMetricsLabelProps = {
    children: ReactNode;
};

type IncidentInlineFormRootProps = {
    children: ReactNode;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type IncidentInlineFormFieldProps = {
    children: ReactNode;
};

function IncidentMetricsRoot({ children }: IncidentMetricsRootProps) {
    return <section className="crud-metrics">{children}</section>;
}

function IncidentMetricsItem({ children }: IncidentMetricsItemProps) {
    return <div className="crud-metric">{children}</div>;
}

function IncidentMetricsValue({ children }: IncidentMetricsValueProps) {
    return <strong>{children}</strong>;
}

function IncidentMetricsLabel({ children }: IncidentMetricsLabelProps) {
    return <span>{children}</span>;
}

export const IncidentMetrics = Object.assign(IncidentMetricsRoot, {
    Item: IncidentMetricsItem,
    Value: IncidentMetricsValue,
    Label: IncidentMetricsLabel,
});

function IncidentInlineFormRoot({ children, onSubmit }: IncidentInlineFormRootProps) {
    return (
        <form className="crud-inline-form" onSubmit={onSubmit}>
            {children}
        </form>
    );
}

function IncidentInlineFormField({ children }: IncidentInlineFormFieldProps) {
    return <div className="crud-field">{children}</div>;
}

export const IncidentInlineForm = Object.assign(IncidentInlineFormRoot, {
    Field: IncidentInlineFormField,
});