import { Button as Button_2 } from '@base-ui/react/button';
import { ClassProp } from 'class-variance-authority/types';
import { JSX } from 'react/jsx-runtime';
import { VariantProps } from 'class-variance-authority';

export declare function Button({ children, className, intent, size, ...props }: ButtonProps): JSX.Element;

export declare type ButtonProps = Button_2.Props & VariantProps<typeof buttonVariants>;

export declare const buttonVariants: (props?: ({
    intent?: "default" | null | undefined;
    size?: "default" | null | undefined;
} & ClassProp) | undefined) => string;

export { }
