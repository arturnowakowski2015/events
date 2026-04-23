import type { ReactNode } from 'react';

type HeroRootProps = {
    children: ReactNode;
};

type HeroKickerProps = {
    children: ReactNode;
};

type HeroTitleProps = {
    children: ReactNode;
};

type HeroDescriptionProps = {
    children: ReactNode;
};

function HeroRoot({ children }: HeroRootProps) {
    return <section className="crud-hero">{children}</section>;
}

function HeroKicker({ children }: HeroKickerProps) {
    return <div className="crud-kicker">{children}</div>;
}

function HeroTitle({ children }: HeroTitleProps) {
    return <h2>{children}</h2>;
}

function HeroDescription({ children }: HeroDescriptionProps) {
    return <p>{children}</p>;
}

export const Hero = Object.assign(HeroRoot, {
    Kicker: HeroKicker,
    Title: HeroTitle,
    Description: HeroDescription,
});
