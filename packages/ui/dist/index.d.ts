import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { ClassProp } from 'class-variance-authority/types';
import { ClassValue } from 'clsx';
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { DayPicker } from 'react-day-picker';
import { default as default_2 } from 'react';
import { Dialog as Dialog_2 } from '@base-ui/react/dialog';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset';
import { Form as FormPrimitive } from '@base-ui/react/form';
import { OTPInput as InputOTPPrimitive } from 'input-otp';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { Loader2Icon } from 'lucide-react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Meter as MeterPrimitive } from '@base-ui/react/meter';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import * as React_2 from 'react';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { useRender } from '@base-ui/react/use-render';
import { VariantProps } from 'class-variance-authority';

export declare function Accordion(props: AccordionPrimitive.Root.Props): default_2.ReactElement;

export declare function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props): default_2.ReactElement;

declare function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props): default_2.ReactElement;
export { AccordionPanel as AccordionContent }
export { AccordionPanel }

export { AccordionPrimitive }

export declare function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props): default_2.ReactElement;

export declare function Alert({ className, variant, ...props }: React_2.ComponentProps<'div'> & VariantProps<typeof alertVariants>): React_2.ReactElement;

export declare function AlertAction({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function AlertDescription({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare const AlertDialog: typeof AlertDialogPrimitive.Root;

declare function AlertDialogBackdrop({ className, ...props }: AlertDialogPrimitive.Backdrop.Props): default_2.ReactElement;
export { AlertDialogBackdrop }
export { AlertDialogBackdrop as AlertDialogOverlay }

export declare function AlertDialogClose(props: AlertDialogPrimitive.Close.Props): default_2.ReactElement;

export declare const AlertDialogCreateHandle: typeof AlertDialogPrimitive.createHandle;

export declare function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props): default_2.ReactElement;

export declare function AlertDialogFooter({ className, variant, ...props }: default_2.ComponentProps<'div'> & {
    variant?: 'default' | 'bare';
}): default_2.ReactElement;

export declare function AlertDialogHeader({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

declare function AlertDialogPopup({ className, bottomStickOnMobile, ...props }: AlertDialogPrimitive.Popup.Props & {
    bottomStickOnMobile?: boolean;
}): default_2.ReactElement;
export { AlertDialogPopup as AlertDialogContent }
export { AlertDialogPopup }

export declare const AlertDialogPortal: typeof AlertDialogPrimitive.Portal;

export { AlertDialogPrimitive }

export declare function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props): default_2.ReactElement;

export declare function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props): default_2.ReactElement;

export declare function AlertDialogViewport({ className, ...props }: AlertDialogPrimitive.Viewport.Props): default_2.ReactElement;

export declare function AlertTitle({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

declare const alertVariants: (props?: ({
    variant?: "default" | "error" | "info" | "success" | "warning" | null | undefined;
} & ClassProp) | undefined) => string;

export declare const anchoredToastManager: ReturnType<typeof ToastPrimitive.createToastManager>;

export declare function AnchoredToastProvider({ children, ...props }: ToastPrimitive.Provider.Props): default_2.ReactElement;

export declare const Autocomplete: typeof AutocompletePrimitive.Root;

export declare function AutocompleteClear({ className, ...props }: AutocompletePrimitive.Clear.Props): default_2.ReactElement;

export declare function AutocompleteCollection({ ...props }: AutocompletePrimitive.Collection.Props): default_2.ReactElement;

export declare function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props): default_2.ReactElement;

export declare function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props): default_2.ReactElement;

export declare function AutocompleteGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props): default_2.ReactElement;

export declare function AutocompleteInput({ className, showTrigger, showClear, startAddon, size, triggerProps, clearProps, ...props }: Omit<AutocompletePrimitive.Input.Props, 'size'> & {
    showTrigger?: boolean;
    showClear?: boolean;
    startAddon?: default_2.ReactNode;
    size?: 'sm' | 'default' | 'lg' | number;
    ref?: default_2.Ref<HTMLInputElement>;
    triggerProps?: AutocompletePrimitive.Trigger.Props;
    clearProps?: AutocompletePrimitive.Clear.Props;
}): default_2.ReactElement;

export declare function AutocompleteItem({ className, children, ...props }: AutocompletePrimitive.Item.Props): default_2.ReactElement;

export declare function AutocompleteList({ className, ...props }: AutocompletePrimitive.List.Props): default_2.ReactElement;

export declare function AutocompletePopup({ className, children, side, sideOffset, alignOffset, align, anchor, ...props }: AutocompletePrimitive.Popup.Props & {
    align?: AutocompletePrimitive.Positioner.Props['align'];
    sideOffset?: AutocompletePrimitive.Positioner.Props['sideOffset'];
    alignOffset?: AutocompletePrimitive.Positioner.Props['alignOffset'];
    side?: AutocompletePrimitive.Positioner.Props['side'];
    anchor?: AutocompletePrimitive.Positioner.Props['anchor'];
}): default_2.ReactElement;

export { AutocompletePrimitive }

export declare function AutocompleteRow({ className, ...props }: AutocompletePrimitive.Row.Props): default_2.ReactElement;

export declare function AutocompleteSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props): default_2.ReactElement;

export declare function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props): default_2.ReactElement;

export declare function AutocompleteTrigger({ className, children, ...props }: AutocompletePrimitive.Trigger.Props): default_2.ReactElement;

export declare function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props): default_2.ReactElement;

export declare function Avatar({ className, ...props }: AvatarPrimitive.Root.Props): default_2.ReactElement;

export declare function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props): default_2.ReactElement;

export declare function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props): default_2.ReactElement;

export { AvatarPrimitive }

export declare function Badge({ className, variant, size, render, ...props }: BadgeProps): default_2.ReactElement;

export declare interface BadgeProps extends useRender.ComponentProps<'span'> {
    variant?: VariantProps<typeof badgeVariants>['variant'];
    size?: VariantProps<typeof badgeVariants>['size'];
}

export declare const badgeVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
    variant?: "default" | "error" | "info" | "success" | "warning" | "destructive" | "outline" | "secondary" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function Breadcrumb({ ...props }: React_2.ComponentProps<'nav'>): React_2.ReactElement;

export declare function BreadcrumbEllipsis({ className, ...props }: React_2.ComponentProps<'span'>): React_2.ReactElement;

export declare function BreadcrumbItem({ className, ...props }: React_2.ComponentProps<'li'>): React_2.ReactElement;

export declare function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<'a'>): React_2.ReactElement;

export declare function BreadcrumbList({ className, ...props }: React_2.ComponentProps<'ol'>): React_2.ReactElement;

export declare function BreadcrumbPage({ className, ...props }: React_2.ComponentProps<'span'>): React_2.ReactElement;

export declare function BreadcrumbSeparator({ children, className, ...props }: React_2.ComponentProps<'li'>): React_2.ReactElement;

declare type Breakpoint = keyof typeof BREAKPOINTS;

declare type BreakpointQuery = Breakpoint | `max-${Breakpoint}` | `${Breakpoint}:max-${Breakpoint}`;

declare const BREAKPOINTS: {
    readonly '2xl': 1536;
    readonly lg: 1024;
    readonly md: 768;
    readonly sm: 640;
    readonly xl: 1280;
};

export declare function Button({ className, variant, size, render, children, loading, disabled: disabledProp, ...props }: ButtonProps): React_2.ReactElement;

export declare interface ButtonProps extends useRender.ComponentProps<'button'> {
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
    loading?: boolean;
}

export declare const buttonVariants: (props?: ({
    size?: "default" | "sm" | "lg" | "icon" | "icon-lg" | "icon-sm" | "icon-xl" | "icon-xs" | "xl" | "xs" | null | undefined;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "destructive-outline" | "ghost" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function Calendar({ className, classNames, showOutsideDays, components: userComponents, mode, ...props }: React_2.ComponentProps<typeof DayPicker>): React_2.ReactElement;

export declare function Card({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardAction({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardDescription({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFooter({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrame({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameAction({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameDescription({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameFooter({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameHeader({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameTitle({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardHeader({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

declare function CardPanel({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;
export { CardPanel as CardContent }
export { CardPanel }

export declare function CardTitle({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props): default_2.ReactElement;

export declare function CheckboxGroup({ className, ...props }: CheckboxGroupPrimitive.Props): default_2.ReactElement;

export { CheckboxGroupPrimitive }

export { CheckboxPrimitive }

export declare function cn(...inputs: ClassValue[]): string;

export declare function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props): default_2.ReactElement;

declare function CollapsiblePanel({ className, ...props }: CollapsiblePrimitive.Panel.Props): default_2.ReactElement;
export { CollapsiblePanel as CollapsibleContent }
export { CollapsiblePanel }

export { CollapsiblePrimitive }

export declare function CollapsibleTrigger({ className, ...props }: CollapsiblePrimitive.Trigger.Props): default_2.ReactElement;

export declare function Combobox<Value, Multiple extends boolean | undefined = false>(props: ComboboxPrimitive.Root.Props<Value, Multiple>): React_2.ReactElement;

export declare function ComboboxChip({ children, removeProps, ...props }: ComboboxPrimitive.Chip.Props & {
    removeProps?: ComboboxPrimitive.ChipRemove.Props;
}): React_2.ReactElement;

export declare function ComboboxChipRemove(props: ComboboxPrimitive.ChipRemove.Props): React_2.ReactElement;

export declare function ComboboxChips({ className, children, startAddon, ...props }: ComboboxPrimitive.Chips.Props & {
    startAddon?: React_2.ReactNode;
}): React_2.ReactElement;

export declare function ComboboxChipsInput({ className, size, ...props }: Omit<ComboboxPrimitive.Input.Props, 'size'> & {
    size?: 'sm' | 'default' | 'lg' | number;
    ref?: React_2.Ref<HTMLInputElement>;
}): React_2.ReactElement;

export declare function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props): React_2.ReactElement;

export declare function ComboboxCollection(props: ComboboxPrimitive.Collection.Props): React_2.ReactElement;

export declare const ComboboxContext: React_2.Context<{
    chipsRef: React_2.RefObject<Element | null> | null;
    multiple: boolean;
}>;

export declare function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props): React_2.ReactElement;

export declare function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props): React_2.ReactElement;

export declare function ComboboxGroupLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props): React_2.ReactElement;

export declare function ComboboxInput({ className, showTrigger, showClear, startAddon, size, triggerProps, clearProps, ...props }: Omit<ComboboxPrimitive.Input.Props, 'size'> & {
    showTrigger?: boolean;
    showClear?: boolean;
    startAddon?: React_2.ReactNode;
    size?: 'sm' | 'default' | 'lg' | number;
    ref?: React_2.Ref<HTMLInputElement>;
    triggerProps?: ComboboxPrimitive.Trigger.Props;
    clearProps?: ComboboxPrimitive.Clear.Props;
}): React_2.ReactElement;

export declare function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props): React_2.ReactElement;

export declare function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props): React_2.ReactElement;

export declare function ComboboxPopup({ className, children, side, sideOffset, alignOffset, align, anchor: anchorProp, ...props }: ComboboxPrimitive.Popup.Props & {
    align?: ComboboxPrimitive.Positioner.Props['align'];
    sideOffset?: ComboboxPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: ComboboxPrimitive.Positioner.Props['alignOffset'];
    side?: ComboboxPrimitive.Positioner.Props['side'];
    anchor?: ComboboxPrimitive.Positioner.Props['anchor'];
}): React_2.ReactElement;

export { ComboboxPrimitive }

export declare function ComboboxRow({ className, ...props }: ComboboxPrimitive.Row.Props): React_2.ReactElement;

export declare function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props): React_2.ReactElement;

export declare function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props): React_2.ReactElement;

export declare function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props): React_2.ReactElement;

export declare function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props): React_2.ReactElement;

export declare function Command({ autoHighlight, keepHighlight, ...props }: React_2.ComponentProps<typeof Autocomplete>): React_2.ReactElement;

export declare function CommandCollection({ ...props }: React_2.ComponentProps<typeof AutocompleteCollection>): React_2.ReactElement;

export declare const CommandCreateHandle: typeof Dialog_2.createHandle;

export declare const CommandDialog: typeof Dialog_2.Root;

export declare function CommandDialogBackdrop({ className, ...props }: Dialog_2.Backdrop.Props): React_2.ReactElement;

export declare function CommandDialogPopup({ className, children, ...props }: Dialog_2.Popup.Props): React_2.ReactElement;

export declare const CommandDialogPortal: typeof Dialog_2.Portal;

export declare function CommandDialogTrigger(props: Dialog_2.Trigger.Props): React_2.ReactElement;

export declare function CommandDialogViewport({ className, ...props }: Dialog_2.Viewport.Props): React_2.ReactElement;

export declare function CommandEmpty({ className, ...props }: React_2.ComponentProps<typeof AutocompleteEmpty>): React_2.ReactElement;

export declare function CommandFooter({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function CommandGroup({ className, ...props }: React_2.ComponentProps<typeof AutocompleteGroup>): React_2.ReactElement;

export declare function CommandGroupLabel({ className, ...props }: React_2.ComponentProps<typeof AutocompleteGroupLabel>): React_2.ReactElement;

export declare function CommandInput({ className, placeholder, ...props }: React_2.ComponentProps<typeof AutocompleteInput>): React_2.ReactElement;

export declare function CommandItem({ className, ...props }: React_2.ComponentProps<typeof AutocompleteItem>): React_2.ReactElement;

export declare function CommandList({ className, ...props }: React_2.ComponentProps<typeof AutocompleteList>): React_2.ReactElement;

export declare function CommandPanel({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function CommandSeparator({ className, ...props }: React_2.ComponentProps<typeof AutocompleteSeparator>): React_2.ReactElement;

export declare function CommandShortcut({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare function CursorGrowIcon(props: React_2.ComponentProps<'svg'>): React_2.ReactElement;

export declare const Dialog: typeof Dialog_2.Root;

export { Dialog_2 as CommandDialogPrimitive }
export { Dialog_2 as DialogPrimitive }

declare function DialogBackdrop({ className, ...props }: Dialog_2.Backdrop.Props): default_2.ReactElement;
export { DialogBackdrop }
export { DialogBackdrop as DialogOverlay }

export declare function DialogClose(props: Dialog_2.Close.Props): default_2.ReactElement;

export declare const DialogCreateHandle: typeof Dialog_2.createHandle;

export declare function DialogDescription({ className, ...props }: Dialog_2.Description.Props): default_2.ReactElement;

export declare function DialogFooter({ className, variant, render, ...props }: useRender.ComponentProps<'div'> & {
    variant?: 'default' | 'bare';
}): default_2.ReactElement;

export declare function DialogHeader({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function DialogPanel({ className, scrollFade, render, ...props }: useRender.ComponentProps<'div'> & {
    scrollFade?: boolean;
}): default_2.ReactElement;

declare function DialogPopup({ className, children, showCloseButton, bottomStickOnMobile, closeProps, ...props }: Dialog_2.Popup.Props & {
    showCloseButton?: boolean;
    bottomStickOnMobile?: boolean;
    closeProps?: Dialog_2.Close.Props;
}): default_2.ReactElement;
export { DialogPopup as DialogContent }
export { DialogPopup }

export declare const DialogPortal: typeof Dialog_2.Portal;

export declare function DialogTitle({ className, ...props }: Dialog_2.Title.Props): default_2.ReactElement;

export declare function DialogTrigger(props: Dialog_2.Trigger.Props): default_2.ReactElement;

export declare function DialogViewport({ className, ...props }: Dialog_2.Viewport.Props): default_2.ReactElement;

declare type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export declare function Drawer({ swipeDirection, position, ...props }: DrawerPrimitive.Root.Props & {
    position?: DrawerPosition;
}): default_2.ReactElement;

export declare function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props): default_2.ReactElement;

export declare function DrawerBar({ className, position: positionProp, render, ...props }: useRender.ComponentProps<'div'> & {
    position?: DrawerPosition;
}): default_2.ReactElement;

export declare function DrawerClose(props: DrawerPrimitive.Close.Props): default_2.ReactElement;

export declare const DrawerContent: typeof DrawerPrimitive.Content;

export declare const DrawerCreateHandle: typeof DrawerPrimitive.createHandle;

export declare function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props): default_2.ReactElement;

export declare function DrawerFooter({ className, variant, allowSelection, render, ...props }: useRender.ComponentProps<'div'> & {
    variant?: 'default' | 'bare';
    allowSelection?: boolean;
}): default_2.ReactElement;

export declare function DrawerHeader({ className, allowSelection, render, ...props }: useRender.ComponentProps<'div'> & {
    allowSelection?: boolean;
}): default_2.ReactElement;

export declare function DrawerMenu({ className, render, ...props }: useRender.ComponentProps<'nav'>): default_2.ReactElement;

export declare function DrawerMenuCheckboxItem({ className, children, checked, defaultChecked, onCheckedChange, variant, disabled, render, ...props }: CheckboxPrimitive.Root.Props & {
    variant?: 'default' | 'switch';
    render?: default_2.ReactElement;
}): default_2.ReactElement;

export declare function DrawerMenuGroup({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function DrawerMenuGroupLabel({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function DrawerMenuItem({ className, variant, render, disabled, ...props }: useRender.ComponentProps<'button'> & {
    variant?: 'default' | 'destructive';
}): default_2.ReactElement;

export declare function DrawerMenuRadioGroup({ className, ...props }: RadioGroupPrimitive.Props): default_2.ReactElement;

export declare function DrawerMenuRadioItem({ className, children, value, disabled, render, ...props }: RadioPrimitive.Root.Props & {
    value: string;
    render?: default_2.ReactElement;
}): default_2.ReactElement;

export declare function DrawerMenuSeparator({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function DrawerMenuTrigger({ className, children, ...props }: DrawerPrimitive.Trigger.Props): default_2.ReactElement;

export declare function DrawerPanel({ className, scrollFade, scrollable, allowSelection, render, ...props }: useRender.ComponentProps<'div'> & {
    scrollFade?: boolean;
    scrollable?: boolean;
    allowSelection?: boolean;
}): default_2.ReactElement;

export declare function DrawerPopup({ className, children, showCloseButton, position: positionProp, variant, showBar, ...props }: DrawerPrimitive.Popup.Props & {
    showCloseButton?: boolean;
    position?: DrawerPosition;
    variant?: 'default' | 'straight' | 'inset';
    showBar?: boolean;
}): default_2.ReactElement;

export declare const DrawerPortal: typeof DrawerPrimitive.Portal;

declare type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';

export { DrawerPrimitive }

export declare function DrawerSwipeArea({ className, position: positionProp, ...props }: DrawerPrimitive.SwipeArea.Props & {
    position?: DrawerPosition;
}): default_2.ReactElement;

export declare function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props): default_2.ReactElement;

export declare function DrawerTrigger(props: DrawerPrimitive.Trigger.Props): default_2.ReactElement;

export declare function DrawerViewport({ className, position, variant, ...props }: DrawerPrimitive.Viewport.Props & {
    position?: DrawerPosition;
    variant?: 'default' | 'straight' | 'inset';
}): default_2.ReactElement;

export declare function Empty({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function EmptyContent({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function EmptyDescription({ className, ...props }: default_2.ComponentProps<'p'>): default_2.ReactElement;

export declare function EmptyHeader({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function EmptyMedia({ className, variant, ...props }: default_2.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>): default_2.ReactElement;

declare const emptyMediaVariants: (props?: ({
    variant?: "default" | "icon" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function EmptyTitle({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function Field({ className, ...props }: FieldPrimitive.Root.Props): default_2.ReactElement;

export declare const FieldControl: typeof FieldPrimitive.Control;

export declare function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props): default_2.ReactElement;

export declare function FieldError({ className, ...props }: FieldPrimitive.Error.Props): default_2.ReactElement;

export declare function FieldItem({ className, ...props }: FieldPrimitive.Item.Props): default_2.ReactElement;

export declare function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props): default_2.ReactElement;

export { FieldPrimitive }

export declare function Fieldset({ className, ...props }: FieldsetPrimitive.Root.Props): default_2.ReactElement;

export declare function FieldsetLegend({ className, ...props }: FieldsetPrimitive.Legend.Props): default_2.ReactElement;

export { FieldsetPrimitive }

export declare const FieldValidity: typeof FieldPrimitive.Validity;

export declare function Form({ className, ...props }: FormPrimitive.Props): default_2.ReactElement;

export { FormPrimitive }

export declare function Frame({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function FrameDescription({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function FrameFooter({ className, ...props }: React_2.ComponentProps<'footer'>): React_2.ReactElement;

export declare function FrameHeader({ className, ...props }: React_2.ComponentProps<'header'>): React_2.ReactElement;

export declare function FramePanel({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function FrameTitle({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

declare function Group({ className, orientation, children, ...props }: {
    className?: string;
    orientation?: VariantProps<typeof groupVariants>['orientation'];
    children: React_2.ReactNode;
} & React_2.ComponentProps<'div'>): React_2.ReactElement;
export { Group as ButtonGroup }
export { Group }

declare function GroupSeparator({ className, orientation, ...props }: {
    className?: string;
} & React_2.ComponentProps<typeof Separator>): React_2.ReactElement;
export { GroupSeparator as ButtonGroupSeparator }
export { GroupSeparator }

declare function GroupText({ className, render, ...props }: useRender.ComponentProps<'div'>): React_2.ReactElement;
export { GroupText as ButtonGroupText }
export { GroupText }

export declare const groupVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function Input({ className, size, unstyled, nativeInput, ...props }: InputProps): React_2.ReactElement;

export declare function InputGroup({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function InputGroupAddon({ className, align, ...props }: React_2.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>): React_2.ReactElement;

declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-end" | "inline-start" | "block-end" | "block-start" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function InputGroupInput({ className, ...props }: InputProps): React_2.ReactElement;

export declare function InputGroupText({ className, ...props }: React_2.ComponentProps<'span'>): React_2.ReactElement;

export declare function InputGroupTextarea({ className, ...props }: TextareaProps): React_2.ReactElement;

export declare function InputOTP({ className, containerClassName, ...props }: InputOTPProps): React_2.ReactElement;

export declare function InputOTPGroup({ className, size, ...props }: React_2.ComponentProps<'div'> & {
    size?: InputOTPSize;
}): React_2.ReactElement;

export { InputOTPPrimitive }

export declare type InputOTPProps = DistributiveOmit<React_2.ComponentProps<typeof InputOTPPrimitive>, 'size' | 'data-size'> & {
    containerClassName?: string;
};

export declare function InputOTPSeparator({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

declare type InputOTPSize = 'default' | 'lg';

export declare function InputOTPSlot({ index, className, ...props }: React_2.ComponentProps<'div'> & {
    index: number;
}): React_2.ReactElement;

export { InputPrimitive }

export declare type InputProps = Omit<InputPrimitive.Props & React_2.RefAttributes<HTMLInputElement>, 'size'> & {
    size?: 'sm' | 'default' | 'lg' | number;
    unstyled?: boolean;
    nativeInput?: boolean;
};

export declare function Kbd({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare function KbdGroup({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare function Label({ className, render, ...props }: useRender.ComponentProps<'label'>): default_2.ReactElement;

export declare interface MediaQueryInput {
    min?: Breakpoint | number;
    max?: Breakpoint | number;
    /** Touch-like input (finger). Use "fine" for mouse/trackpad. */
    pointer?: 'coarse' | 'fine';
}

declare const Menu: typeof MenuPrimitive.Root;
export { Menu as DropdownMenu }
export { Menu }

declare function MenuCheckboxItem({ className, children, checked, variant, ...props }: MenuPrimitive.CheckboxItem.Props & {
    variant?: 'default' | 'switch';
}): React_2.ReactElement;
export { MenuCheckboxItem as DropdownMenuCheckboxItem }
export { MenuCheckboxItem }

declare const MenuCreateHandle: typeof MenuPrimitive.createHandle;
export { MenuCreateHandle as DropdownMenuCreateHandle }
export { MenuCreateHandle }

declare function MenuGroup(props: MenuPrimitive.Group.Props): React_2.ReactElement;
export { MenuGroup as DropdownMenuGroup }
export { MenuGroup }

declare function MenuGroupLabel({ className, inset, ...props }: MenuPrimitive.GroupLabel.Props & {
    inset?: boolean;
}): React_2.ReactElement;
export { MenuGroupLabel as DropdownMenuLabel }
export { MenuGroupLabel }

declare function MenuItem({ className, inset, variant, ...props }: MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}): React_2.ReactElement;
export { MenuItem as DropdownMenuItem }
export { MenuItem }

declare function MenuPopup({ children, className, sideOffset, align, alignOffset, side, anchor, ...props }: MenuPrimitive.Popup.Props & {
    align?: MenuPrimitive.Positioner.Props['align'];
    sideOffset?: MenuPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: MenuPrimitive.Positioner.Props['alignOffset'];
    side?: MenuPrimitive.Positioner.Props['side'];
    anchor?: MenuPrimitive.Positioner.Props['anchor'];
}): React_2.ReactElement;
export { MenuPopup as DropdownMenuContent }
export { MenuPopup }

declare const MenuPortal: typeof MenuPrimitive.Portal;
export { MenuPortal as DropdownMenuPortal }
export { MenuPortal }

export { MenuPrimitive }

declare function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props): React_2.ReactElement;
export { MenuRadioGroup as DropdownMenuRadioGroup }
export { MenuRadioGroup }

declare function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props): React_2.ReactElement;
export { MenuRadioItem as DropdownMenuRadioItem }
export { MenuRadioItem }

declare function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props): React_2.ReactElement;
export { MenuSeparator as DropdownMenuSeparator }
export { MenuSeparator }

declare function MenuShortcut({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;
export { MenuShortcut as DropdownMenuShortcut }
export { MenuShortcut }

declare function MenuSub(props: MenuPrimitive.SubmenuRoot.Props): React_2.ReactElement;
export { MenuSub as DropdownMenuSub }
export { MenuSub }

declare function MenuSubPopup({ className, sideOffset, alignOffset, align, ...props }: MenuPrimitive.Popup.Props & {
    align?: MenuPrimitive.Positioner.Props['align'];
    sideOffset?: MenuPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: MenuPrimitive.Positioner.Props['alignOffset'];
}): React_2.ReactElement;
export { MenuSubPopup as DropdownMenuSubContent }
export { MenuSubPopup }

declare function MenuSubTrigger({ className, inset, children, ...props }: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}): React_2.ReactElement;
export { MenuSubTrigger as DropdownMenuSubTrigger }
export { MenuSubTrigger }

declare function MenuTrigger({ className, children, ...props }: MenuPrimitive.Trigger.Props): React_2.ReactElement;
export { MenuTrigger as DropdownMenuTrigger }
export { MenuTrigger }

export declare function Meter({ className, children, ...props }: MeterPrimitive.Root.Props): default_2.ReactElement;

export declare function MeterIndicator({ className, ...props }: MeterPrimitive.Indicator.Props): default_2.ReactElement;

export declare function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props): default_2.ReactElement;

export { MeterPrimitive }

export declare function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props): default_2.ReactElement;

export declare function MeterValue({ className, ...props }: MeterPrimitive.Value.Props): default_2.ReactElement;

export declare function NumberField({ id, className, size, ...props }: NumberFieldPrimitive.Root.Props & {
    size?: 'sm' | 'default' | 'lg';
}): React_2.ReactElement;

export declare const NumberFieldContext: React_2.Context<{
    fieldId: string;
} | null>;

export declare function NumberFieldDecrement({ className, ...props }: NumberFieldPrimitive.Decrement.Props): React_2.ReactElement;

export declare function NumberFieldGroup({ className, ...props }: NumberFieldPrimitive.Group.Props): React_2.ReactElement;

export declare function NumberFieldIncrement({ className, ...props }: NumberFieldPrimitive.Increment.Props): React_2.ReactElement;

export declare function NumberFieldInput({ className, ...props }: NumberFieldPrimitive.Input.Props): React_2.ReactElement;

export { NumberFieldPrimitive }

export declare function NumberFieldScrubArea({ className, label, ...props }: NumberFieldPrimitive.ScrubArea.Props & {
    label: string;
}): React_2.ReactElement;

export declare function Pagination({ className, ...props }: React_2.ComponentProps<'nav'>): React_2.ReactElement;

export declare function PaginationContent({ className, ...props }: React_2.ComponentProps<'ul'>): React_2.ReactElement;

export declare function PaginationEllipsis({ className, ...props }: React_2.ComponentProps<'span'>): React_2.ReactElement;

export declare function PaginationItem({ ...props }: React_2.ComponentProps<'li'>): React_2.ReactElement;

export declare function PaginationLink({ className, isActive, size, render, ...props }: PaginationLinkProps): React_2.ReactElement;

export declare type PaginationLinkProps = {
    isActive?: boolean;
    size?: React_2.ComponentProps<typeof Button>['size'];
} & useRender.ComponentProps<'a'>;

export declare function PaginationNext({ className, ...props }: React_2.ComponentProps<typeof PaginationLink>): React_2.ReactElement;

export declare function PaginationPrevious({ className, ...props }: React_2.ComponentProps<typeof PaginationLink>): React_2.ReactElement;

export declare const Popover: typeof PopoverPrimitive.Root;

export declare function PopoverClose({ ...props }: PopoverPrimitive.Close.Props): default_2.ReactElement;

export declare const PopoverCreateHandle: typeof PopoverPrimitive.createHandle;

export declare function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props): default_2.ReactElement;

declare function PopoverPopup({ children, className, side, align, sideOffset, alignOffset, tooltipStyle, anchor, ...props }: PopoverPrimitive.Popup.Props & {
    side?: PopoverPrimitive.Positioner.Props['side'];
    align?: PopoverPrimitive.Positioner.Props['align'];
    sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: PopoverPrimitive.Positioner.Props['alignOffset'];
    tooltipStyle?: boolean;
    anchor?: PopoverPrimitive.Positioner.Props['anchor'];
}): default_2.ReactElement;
export { PopoverPopup as PopoverContent }
export { PopoverPopup }

export { PopoverPrimitive }

export declare function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props): default_2.ReactElement;

export declare function PopoverTrigger({ className, children, ...props }: PopoverPrimitive.Trigger.Props): default_2.ReactElement;

declare const PreviewCard: typeof PreviewCardPrimitive.Root;
export { PreviewCard as HoverCard }
export { PreviewCard }

declare function PreviewCardPopup({ className, children, align, sideOffset, anchor, ...props }: PreviewCardPrimitive.Popup.Props & {
    align?: PreviewCardPrimitive.Positioner.Props['align'];
    sideOffset?: PreviewCardPrimitive.Positioner.Props['sideOffset'];
    anchor?: PreviewCardPrimitive.Positioner.Props['anchor'];
}): default_2.ReactElement;
export { PreviewCardPopup as HoverCardContent }
export { PreviewCardPopup }

export { PreviewCardPrimitive }

declare function PreviewCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props): default_2.ReactElement;
export { PreviewCardTrigger as HoverCardTrigger }
export { PreviewCardTrigger }

export declare function Progress({ className, children, ...props }: ProgressPrimitive.Root.Props): default_2.ReactElement;

export declare function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props): default_2.ReactElement;

export declare function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props): default_2.ReactElement;

export { ProgressPrimitive }

export declare function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props): default_2.ReactElement;

export declare function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props): default_2.ReactElement;

declare function Radio({ className, ...props }: RadioPrimitive.Root.Props): default_2.ReactElement;
export { Radio }
export { Radio as RadioGroupItem }

export declare function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props): default_2.ReactElement;

export { RadioGroupPrimitive }

export { RadioPrimitive }

export declare function ScrollArea({ className, children, scrollFade, scrollbarGutter, ...props }: ScrollAreaPrimitive.Root.Props & {
    scrollFade?: boolean;
    scrollbarGutter?: boolean;
}): default_2.ReactElement;

export { ScrollAreaPrimitive }

export declare function ScrollBar({ className, orientation, ...props }: ScrollAreaPrimitive.Scrollbar.Props): default_2.ReactElement;

export declare const Select: typeof SelectPrimitive.Root;

export declare function SelectButton({ className, size, render, children, ...props }: SelectButtonProps): React_2.ReactElement;

export declare interface SelectButtonProps extends useRender.ComponentProps<'button'> {
    size?: VariantProps<typeof selectTriggerVariants>['size'];
}

export declare function SelectGroup(props: SelectPrimitive.Group.Props): React_2.ReactElement;

export declare function SelectGroupLabel(props: SelectPrimitive.GroupLabel.Props): React_2.ReactElement;

export declare function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props): React_2.ReactElement;

export declare function SelectLabel({ className, ...props }: SelectPrimitive.Label.Props): React_2.ReactElement;

declare function SelectPopup({ className, children, side, sideOffset, align, alignOffset, alignItemWithTrigger, anchor, ...props }: SelectPrimitive.Popup.Props & {
    side?: SelectPrimitive.Positioner.Props['side'];
    sideOffset?: SelectPrimitive.Positioner.Props['sideOffset'];
    align?: SelectPrimitive.Positioner.Props['align'];
    alignOffset?: SelectPrimitive.Positioner.Props['alignOffset'];
    alignItemWithTrigger?: SelectPrimitive.Positioner.Props['alignItemWithTrigger'];
    anchor?: SelectPrimitive.Positioner.Props['anchor'];
}): React_2.ReactElement;
export { SelectPopup as SelectContent }
export { SelectPopup }

export { SelectPrimitive }

export declare function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props): React_2.ReactElement;

export declare function SelectTrigger({ className, size, children, ...props }: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>): React_2.ReactElement;

export declare const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4";

export declare const selectTriggerVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function SelectValue({ className, ...props }: SelectPrimitive.Value.Props): React_2.ReactElement;

export declare function Separator({ className, orientation, ...props }: SeparatorPrimitive.Props): default_2.ReactElement;

export { SeparatorPrimitive }

export declare function Skeleton({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function Slider({ className, children, defaultValue, value, min, max, ...props }: SliderPrimitive.Root.Props): React_2.ReactElement;

export { SliderPrimitive }

export declare function SliderValue({ className, ...props }: SliderPrimitive.Value.Props): React_2.ReactElement;

export declare function Spinner({ className, ...props }: default_2.ComponentProps<typeof Loader2Icon>): default_2.ReactElement;

export declare function Switch({ className, ...props }: SwitchPrimitive.Root.Props): default_2.ReactElement;

export { SwitchPrimitive }

export declare function Table({ className, ...props }: React_2.ComponentProps<'table'>): React_2.ReactElement;

export declare function TableBody({ className, ...props }: React_2.ComponentProps<'tbody'>): React_2.ReactElement;

export declare function TableCaption({ className, ...props }: React_2.ComponentProps<'caption'>): React_2.ReactElement;

export declare function TableCell({ className, ...props }: React_2.ComponentProps<'td'>): React_2.ReactElement;

export declare function TableFooter({ className, ...props }: React_2.ComponentProps<'tfoot'>): React_2.ReactElement;

export declare function TableHead({ className, ...props }: React_2.ComponentProps<'th'>): React_2.ReactElement;

export declare function TableHeader({ className, ...props }: React_2.ComponentProps<'thead'>): React_2.ReactElement;

export declare function TableRow({ className, ...props }: React_2.ComponentProps<'tr'>): React_2.ReactElement;

export declare function Tabs({ className, ...props }: TabsPrimitive.Root.Props): default_2.ReactElement;

export declare function TabsList({ variant, className, children, ...props }: TabsPrimitive.List.Props & {
    variant?: TabsVariant;
}): default_2.ReactElement;

declare function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props): default_2.ReactElement;
export { TabsPanel as TabsContent }
export { TabsPanel }

export { TabsPrimitive }

declare function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props): default_2.ReactElement;
export { TabsTab }
export { TabsTab as TabsTrigger }

export declare type TabsVariant = 'default' | 'underline';

export declare function Textarea({ className, size, unstyled, ref, ...props }: TextareaProps): React_2.ReactElement;

export declare type TextareaProps = React_2.ComponentPropsWithoutRef<'textarea'> & React_2.RefAttributes<HTMLElement> & {
    size?: 'sm' | 'default' | 'lg' | number;
    unstyled?: boolean;
};

export declare const toastManager: ReturnType<typeof ToastPrimitive.createToastManager>;

export declare type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export { ToastPrimitive }

export declare function ToastProvider({ children, position, ...props }: ToastProviderProps): default_2.ReactElement;

export declare interface ToastProviderProps extends ToastPrimitive.Provider.Props {
    position?: ToastPosition;
}

export declare function Toggle({ className, variant, size, ...props }: TogglePrimitive.Props & VariantProps<typeof toggleVariants>): default_2.ReactElement;

export declare function ToggleGroup({ className, variant, size, orientation, children, ...props }: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>): React_2.ReactElement;

export declare const ToggleGroupContext: React_2.Context<VariantProps<typeof toggleVariants>>;

export declare function ToggleGroupItem({ className, children, variant, size, ...props }: TogglePrimitive.Props & VariantProps<typeof toggleVariants>): React_2.ReactElement;

export { ToggleGroupPrimitive }

export declare function ToggleGroupSeparator({ className, orientation, ...props }: {
    className?: string;
} & React_2.ComponentProps<typeof Separator>): React_2.ReactElement;

export { TogglePrimitive }

export declare const toggleVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
    variant?: "default" | "outline" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props): default_2.ReactElement;

export declare function ToolbarButton({ className, ...props }: ToolbarPrimitive.Button.Props): default_2.ReactElement;

export declare function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props): default_2.ReactElement;

export declare function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props): default_2.ReactElement;

export declare function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props): default_2.ReactElement;

export { ToolbarPrimitive }

export declare function ToolbarSeparator({ className, ...props }: ToolbarPrimitive.Separator.Props): default_2.ReactElement;

export declare const Tooltip: typeof TooltipPrimitive.Root;

export declare const TooltipCreateHandle: typeof TooltipPrimitive.createHandle;

declare function TooltipPopup({ className, align, sideOffset, side, anchor, children, ...props }: TooltipPrimitive.Popup.Props & {
    align?: TooltipPrimitive.Positioner.Props['align'];
    side?: TooltipPrimitive.Positioner.Props['side'];
    sideOffset?: TooltipPrimitive.Positioner.Props['sideOffset'];
    anchor?: TooltipPrimitive.Positioner.Props['anchor'];
}): default_2.ReactElement;
export { TooltipPopup as TooltipContent }
export { TooltipPopup }

export { TooltipPrimitive }

export declare const TooltipProvider: typeof TooltipPrimitive.Provider;

export declare function TooltipTrigger(props: TooltipPrimitive.Trigger.Props): default_2.ReactElement;

export declare const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter;

export declare const useComboboxFilter: typeof ComboboxPrimitive.useFilter;

export declare function useIsMobile(): boolean;

export declare function useMediaQuery(query: BreakpointQuery | MediaQueryInput | (string & {})): boolean;

export { }
