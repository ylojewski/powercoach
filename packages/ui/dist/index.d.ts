import { ClassProp } from 'class-variance-authority/types';
import { JSX } from 'react/jsx-runtime';
import * as React_2 from 'react';
import { VariantProps } from 'class-variance-authority';

export declare function Button({ className, variant, size, asChild, ...props }: ButtonProps): JSX.Element;

export declare type ButtonProps = React_2.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
};

export declare const buttonVariants: (props?: ({
    size?: "default" | "icon" | "icon-lg" | "icon-sm" | "lg" | "sm" | null | undefined;
    variant?: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary" | null | undefined;
} & ClassProp) | undefined) => string;

export { }
