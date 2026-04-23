import type { FormEvent, ReactNode } from 'react';

type ParticipantFormLayoutRootProps = {
    children: ReactNode;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type ParticipantFormLayoutGridProps = {
    children: ReactNode;
};

type ParticipantFormLayoutFieldProps = {
    children: ReactNode;
};

type ParticipantFormGroupRootProps = {
    children: ReactNode;
};

type ParticipantFormGroupLabelProps = {
    children: ReactNode;
};

function ParticipantFormLayoutRoot({ children, onSubmit }: ParticipantFormLayoutRootProps) {
    return (
        <form className="crud-form" onSubmit={onSubmit}>
            {children}
        </form>
    );
}

function ParticipantFormLayoutGrid({ children }: ParticipantFormLayoutGridProps) {
    return <div className="crud-form__grid">{children}</div>;
}

function ParticipantFormLayoutField({ children }: ParticipantFormLayoutFieldProps) {
    return <div className="crud-field">{children}</div>;
}

function ParticipantFormGroupRoot({ children }: ParticipantFormGroupRootProps) {
    return <div className="crud-group">{children}</div>;
}

function ParticipantFormGroupLabel({ children }: ParticipantFormGroupLabelProps) {
    return <div className="crud-group__label">{children}</div>;
}

export const ParticipantFormLayout = Object.assign(ParticipantFormLayoutRoot, {
    Grid: ParticipantFormLayoutGrid,
    Field: ParticipantFormLayoutField,
});

export const ParticipantFormGroup = Object.assign(ParticipantFormGroupRoot, {
    Label: ParticipantFormGroupLabel,
});
