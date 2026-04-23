import type { FormEvent, ReactNode } from 'react';

type ParticipantMetricsRootProps = {
    children: ReactNode;
};

type ParticipantMetricsItemProps = {
    children: ReactNode;
};

type ParticipantMetricsValueProps = {
    children: ReactNode;
};

type ParticipantMetricsLabelProps = {
    children: ReactNode;
};

type ParticipantInlineFormRootProps = {
    children: ReactNode;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type ParticipantInlineFormFieldProps = {
    children: ReactNode;
};

function ParticipantMetricsRoot({ children }: ParticipantMetricsRootProps) {
    return <section className="crud-metrics">{children}</section>;
}

function ParticipantMetricsItem({ children }: ParticipantMetricsItemProps) {
    return <div className="crud-metric">{children}</div>;
}

function ParticipantMetricsValue({ children }: ParticipantMetricsValueProps) {
    return <strong>{children}</strong>;
}

function ParticipantMetricsLabel({ children }: ParticipantMetricsLabelProps) {
    return <span>{children}</span>;
}

export const ParticipantMetrics = Object.assign(ParticipantMetricsRoot, {
    Item: ParticipantMetricsItem,
    Value: ParticipantMetricsValue,
    Label: ParticipantMetricsLabel,
});

function ParticipantInlineFormRoot({ children, onSubmit }: ParticipantInlineFormRootProps) {
    return (
        <form className="crud-inline-form" onSubmit={onSubmit}>
            {children}
        </form>
    );
}

function ParticipantInlineFormField({ children }: ParticipantInlineFormFieldProps) {
    return <div className="crud-field">{children}</div>;
}

export const ParticipantInlineForm = Object.assign(ParticipantInlineFormRoot, {
    Field: ParticipantInlineFormField,
});
