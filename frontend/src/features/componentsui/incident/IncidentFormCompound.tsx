import type { ReactNode } from 'react';

type IncidentFormGroupRootProps = {
    children: ReactNode;
};

type IncidentFormGroupLabelProps = {
    children: ReactNode;
};

type ParticipantChoicesGridProps = {
    children: ReactNode;
};

type ParticipantChoiceProps = {
    children: ReactNode;
};

function IncidentFormGroupRoot({ children }: IncidentFormGroupRootProps) {
    return <div className="crud-group">{children}</div>;
}

function IncidentFormGroupLabel({ children }: IncidentFormGroupLabelProps) {
    return <div className="crud-group__label">{children}</div>;
}

export const IncidentFormGroup = Object.assign(IncidentFormGroupRoot, {
    Label: IncidentFormGroupLabel,
});

function ParticipantChoicesGridRoot({ children }: ParticipantChoicesGridProps) {
    return <div className="crud-checkbox-grid">{children}</div>;
}

function ParticipantChoice({ children }: ParticipantChoiceProps) {
    return <label className="crud-choice">{children}</label>;
}

export const ParticipantChoicesGrid = Object.assign(ParticipantChoicesGridRoot, {
    Choice: ParticipantChoice,
});
