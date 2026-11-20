import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { Button as Button_2 } from '@base-ui/react/button';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { ClassProp } from 'class-variance-authority/types';
import { ClassValue } from 'clsx';
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { ComponentProps } from 'react';
import { ComponentPropsWithRef } from 'react';
import { ComponentType } from 'react';
import { CSSProperties } from 'react';
import { DayPicker } from 'react-day-picker';
import { default as default_2 } from 'react';
import { Dialog as Dialog_2 } from '@base-ui/react/dialog';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset';
import { Form as FormPrimitive } from '@base-ui/react/form';
import { HTMLAttributes } from 'react';
import { ImageLoadingStatus } from '@base-ui/react/avatar';
import { OTPInput as InputOTPPrimitive } from 'input-otp';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { JSX } from 'react/jsx-runtime';
import { Key } from 'react';
import { Loader2Icon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Meter as MeterPrimitive } from '@base-ui/react/meter';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import * as React_2 from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { Ref } from 'react';
import { RefAttributes } from 'react';
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

export declare function Alert({ className, variant, ...props }: AlertProps): React_2.ReactElement;

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

declare function AlertDialogPopup({ className, bottomStickOnMobile, portalProps, ...props }: AlertDialogPrimitive.Popup.Props & {
    bottomStickOnMobile?: boolean;
    portalProps?: AlertDialogPrimitive.Portal.Props;
}): default_2.ReactElement;
export { AlertDialogPopup as AlertDialogContent }
export { AlertDialogPopup }

export declare const AlertDialogPortal: typeof AlertDialogPrimitive.Portal;

export { AlertDialogPrimitive }

export declare function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props): default_2.ReactElement;

export declare function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props): default_2.ReactElement;

export declare function AlertDialogViewport({ className, ...props }: AlertDialogPrimitive.Viewport.Props): default_2.ReactElement;

export declare type AlertProps = React_2.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

export declare function AlertTitle({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

declare const alertVariants: (props?: ({
    variant?: "default" | "error" | "info" | "success" | "warning" | null | undefined;
} & ClassProp) | undefined) => string;

export declare const anchoredToastManager: ReturnType<typeof ToastPrimitive.createToastManager>;

export declare function AnchoredToastProvider({ children, ...props }: ToastPrimitive.Provider.Props): default_2.ReactElement;

export declare const Animations: AnimationsNamespace;

export declare interface AnimationsNamespace {
    RevealAnimation: typeof RevealAnimation;
    SwitchAnimation: typeof SwitchAnimation;
}

export declare function AspectRatio({ fit, ratio, render, style, ...props }: AspectRatioProps): ReactElement | null;

export declare interface AspectRatioProps extends useRender.ComponentProps<'div', Record<string, never>> {
    fit?: 'contain' | 'cover';
    ratio: number;
}

export declare const Autocomplete: AutocompleteNamespace;

declare const Autocomplete_2: typeof AutocompletePrimitive.Root;

export declare function AutocompleteAddOn({ children, className, position, ref, style, ...props }: AutocompleteAddOnProps): ReactElement;

declare type AutocompleteAddOnAriaProp = Extract<keyof ComponentPropsWithRef<'span'>, `aria-${string}`>;

declare type AutocompleteAddOnEventProp = Extract<keyof ComponentPropsWithRef<'span'>, `on${string}`>;

declare type AutocompleteAddOnInteractiveProp = 'accessKey' | 'autoFocus' | 'contentEditable' | 'contextMenu' | 'dangerouslySetInnerHTML' | 'draggable' | 'inert' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'role' | 'suppressContentEditableWarning' | 'tabIndex' | 'title';

export declare type AutocompleteAddOnPosition = InputAddOnPosition;

export declare type AutocompleteAddOnProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'style' | AutocompleteAddOnAriaProp | AutocompleteAddOnEventProp | AutocompleteAddOnInteractiveProp> & {
    children: ReactElement;
    position?: AutocompleteAddOnPosition;
    style?: Omit<CSSProperties, 'pointerEvents'>;
};

export declare function AutocompleteArrow(props: AutocompleteArrowProps): ReactElement;

export declare type AutocompleteArrowProps = AutocompletePrimitive.Arrow.Props;

export declare type AutocompleteArrowState = AutocompletePrimitive.Arrow.State;

export declare function AutocompleteBackdrop(props: AutocompleteBackdropProps): ReactElement;

export declare type AutocompleteBackdropProps = AutocompletePrimitive.Backdrop.Props;

export declare type AutocompleteBackdropState = AutocompletePrimitive.Backdrop.State;

export declare function AutocompleteClear(props: AutocompleteClearProps): ReactElement;

export declare type AutocompleteClearProps = Omit<AutocompletePrimitive.Clear.Props, 'children'>;

export declare type AutocompleteClearState = AutocompletePrimitive.Clear.State;

export declare function AutocompleteCollection({ children }: AutocompleteCollectionProps): ReactElement;

declare function AutocompleteCollection_2({ ...props }: AutocompletePrimitive.Collection.Props): default_2.ReactElement;

export declare type AutocompleteCollectionProps = Omit<AutocompletePrimitive.Collection.Props, 'children'> & {
    children?: AutocompletePrimitive.Collection.Props['children'];
};

export declare type AutocompleteCollectionState = AutocompletePrimitive.Collection.State;

export declare function AutocompleteEmpty({ children, className, ...props }: AutocompleteEmptyProps): ReactElement;

declare function AutocompleteEmpty_2({ className, ...props }: AutocompletePrimitive.Empty.Props): default_2.ReactElement;

export declare type AutocompleteEmptyProps = AutocompletePrimitive.Empty.Props;

export declare type AutocompleteEmptyState = AutocompletePrimitive.Empty.State;

export declare type AutocompleteFilter = ReturnType<typeof AutocompletePrimitive.useFilter>;

export declare type AutocompleteFilterOptions = NonNullable<Parameters<typeof AutocompletePrimitive.useFilter>[0]>;

export declare function AutocompleteGroup({ children, className, items, render, ...props }: AutocompleteGroupProps): ReactElement;

declare function AutocompleteGroup_2({ className, ...props }: AutocompletePrimitive.Group.Props): default_2.ReactElement;

export declare function AutocompleteGroupLabel({ children, className, icon, render, ...props }: AutocompleteGroupLabelProps): ReactElement;

declare function AutocompleteGroupLabel_2({ className, ...props }: AutocompletePrimitive.GroupLabel.Props): default_2.ReactElement;

export declare type AutocompleteGroupLabelProps = AutocompletePrimitive.GroupLabel.Props & {
    icon?: AutocompleteItemIcon;
};

export declare type AutocompleteGroupLabelState = AutocompletePrimitive.GroupLabel.State;

export declare interface AutocompleteGroupOption<ItemValue = AutocompleteItemOption> {
    icon?: AutocompleteItemIcon;
    items: readonly ItemValue[];
    text: string;
}

export declare type AutocompleteGroupProps = AutocompletePrimitive.Group.Props;

export declare type AutocompleteGroupState = AutocompletePrimitive.Group.State;

export declare function AutocompleteIcon(props: AutocompleteIconProps): ReactElement;

export declare type AutocompleteIconProps = Omit<AutocompletePrimitive.Icon.Props, 'children'>;

export declare type AutocompleteIconState = AutocompletePrimitive.Icon.State;

export declare function AutocompleteInput({ className, ref, ...props }: AutocompleteInputProps): ReactElement;

declare function AutocompleteInput_2({ className, showTrigger, showClear, startAddon, size, triggerProps, clearProps, ...props }: Omit<AutocompletePrimitive.Input.Props, 'size'> & {
    showTrigger?: boolean;
    showClear?: boolean;
    startAddon?: default_2.ReactNode;
    size?: 'sm' | 'default' | 'lg' | number;
    ref?: default_2.Ref<HTMLInputElement>;
    triggerProps?: AutocompletePrimitive.Trigger.Props;
    clearProps?: AutocompletePrimitive.Clear.Props;
}): default_2.ReactElement;

export declare function AutocompleteInputGroup({ children, className, ref, ...props }: AutocompleteInputGroupProps): ReactElement;

export declare type AutocompleteInputGroupProps = AutocompletePrimitive.InputGroup.Props;

export declare type AutocompleteInputGroupState = AutocompletePrimitive.InputGroup.State;

export declare type AutocompleteInputProps = AutocompletePrimitive.Input.Props;

export declare type AutocompleteInputState = AutocompletePrimitive.Input.State;

export declare function AutocompleteItem(props: Omit<AutocompleteItemProps, 'ref'> & RefAttributes<HTMLElement>): ReactElement;

declare function AutocompleteItem_2({ className, children, ...props }: AutocompletePrimitive.Item.Props): default_2.ReactElement;

export declare type AutocompleteItemIcon = PopupSurfaceItemIcon;

export declare interface AutocompleteItemOption {
    icon?: AutocompleteItemIcon;
    text: string;
}

export declare type AutocompleteItemProps = AutocompletePrimitive.Item.Props & {
    icon?: AutocompleteItemIcon;
    revealAnimationProps?: boolean | AutocompleteItemRevealAnimationProps;
};

export declare type AutocompleteItemRevealAnimationProps = PopupSurfaceItemRevealAnimationProps;

export declare type AutocompleteItemState = AutocompletePrimitive.Item.State;

export declare function AutocompleteList({ children, className, ...props }: AutocompleteListProps): ReactElement;

declare function AutocompleteList_2({ className, ...props }: AutocompletePrimitive.List.Props): default_2.ReactElement;

declare interface AutocompleteListAutomaticProps {
    children?: undefined;
}

declare interface AutocompleteListCallbackProps {
    children: (item: any, index: number) => ReactNode;
}

declare type AutocompleteListCommonProps = Omit<AutocompletePrimitive.List.Props, 'children'>;

declare interface AutocompleteListNodeProps {
    children: Exclude<ReactNode, undefined>;
}

export declare type AutocompleteListProps = AutocompleteListCommonProps & (AutocompleteListAutomaticProps | AutocompleteListCallbackProps | AutocompleteListNodeProps);

export declare type AutocompleteListState = AutocompletePrimitive.List.State;

export declare interface AutocompleteNamespace {
    AddOn: typeof AutocompleteAddOn;
    Arrow: typeof AutocompleteArrow;
    Backdrop: typeof AutocompleteBackdrop;
    Clear: typeof AutocompleteClear;
    Collection: typeof AutocompleteCollection;
    Empty: typeof AutocompleteEmpty;
    Group: typeof AutocompleteGroup;
    GroupLabel: typeof AutocompleteGroupLabel;
    Icon: typeof AutocompleteIcon;
    Input: typeof AutocompleteInput;
    InputGroup: typeof AutocompleteInputGroup;
    Item: typeof AutocompleteItem;
    List: typeof AutocompleteList;
    Popup: typeof AutocompletePopup;
    Portal: typeof AutocompletePortal;
    Positioner: typeof AutocompletePositioner;
    Root: typeof AutocompleteRoot;
    Row: typeof AutocompleteRow;
    Separator: typeof AutocompleteSeparator;
    Status: typeof AutocompleteStatus;
    Trigger: typeof AutocompleteTrigger;
    useFilter: typeof useAutocompleteFilter;
    useFilteredItems: typeof useAutocompleteFilteredItems;
    Value: typeof AutocompleteValue;
}

export declare function AutocompletePopup({ className, render, style, ...props }: AutocompletePopupProps): ReactElement;

export declare type AutocompletePopupProps = AutocompletePrimitive.Popup.Props;

export declare type AutocompletePopupState = AutocompletePrimitive.Popup.State;

export declare function AutocompletePortal(props: AutocompletePortalProps): ReactElement;

export declare type AutocompletePortalProps = AutocompletePrimitive.Portal.Props;

export declare type AutocompletePortalState = AutocompletePrimitive.Portal.State;

export declare function AutocompletePositioner({ anchor, children, ref, style, ...props }: AutocompletePositionerProps): ReactElement;

export declare type AutocompletePositionerProps = Omit<AutocompletePrimitive.Positioner.Props, 'sideOffset'>;

export declare type AutocompletePositionerState = AutocompletePrimitive.Positioner.State;

export { AutocompletePrimitive }

export declare function AutocompleteRoot<ItemValue extends AutocompleteItemOption, GroupValue extends AutocompleteGroupOption<ItemValue>, Items extends readonly GroupValue[]>(props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items: Items;
}): ReactElement;

export declare function AutocompleteRoot<ItemValue extends AutocompleteItemOption, Items extends readonly ItemValue[]>(props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items: Items;
}): ReactElement;

export declare function AutocompleteRoot<Items extends readonly {
    items: readonly unknown[];
}[]>(props: Omit<AutocompleteRootProps<Items[number]['items'][number]>, 'items'> & {
    items: Items;
}): ReactElement;

export declare function AutocompleteRoot<ItemValue>(props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items?: readonly ItemValue[];
}): ReactElement;

export declare type AutocompleteRootActions = AutocompletePrimitive.Root.Actions;

export declare type AutocompleteRootChangeEventDetails = AutocompletePrimitive.Root.ChangeEventDetails;

export declare type AutocompleteRootChangeEventReason = AutocompletePrimitive.Root.ChangeEventReason;

export declare type AutocompleteRootHighlightEventDetails = AutocompletePrimitive.Root.HighlightEventDetails;

export declare type AutocompleteRootHighlightEventReason = AutocompletePrimitive.Root.HighlightEventReason;

export declare type AutocompleteRootProps<ItemValue> = AutocompletePrimitive.Root.Props<ItemValue> & {
    size?: AutocompleteSize;
};

export declare type AutocompleteRootState = AutocompletePrimitive.Root.State;

export declare function AutocompleteRow(props: AutocompleteRowProps): ReactElement;

export declare type AutocompleteRowProps = AutocompletePrimitive.Row.Props;

export declare type AutocompleteRowState = AutocompletePrimitive.Row.State;

export declare function AutocompleteSeparator(props: AutocompleteSeparatorProps): ReactElement;

declare function AutocompleteSeparator_2({ className, ...props }: AutocompletePrimitive.Separator.Props): default_2.ReactElement;

export declare type AutocompleteSeparatorProps = AutocompletePrimitive.Separator.Props;

export declare type AutocompleteSeparatorState = AutocompletePrimitive.Separator.State;

export declare type AutocompleteSize = PopupSurfaceSize;

export declare function AutocompleteStatus({ children, className, ...props }: AutocompleteStatusProps): ReactElement;

export declare type AutocompleteStatusProps = AutocompletePrimitive.Status.Props;

export declare type AutocompleteStatusState = AutocompletePrimitive.Status.State;

export declare function AutocompleteTrigger({ className, ref, ...props }: AutocompleteTriggerProps): ReactElement;

export declare type AutocompleteTriggerProps = AutocompletePrimitive.Trigger.Props;

export declare type AutocompleteTriggerState = AutocompletePrimitive.Trigger.State;

export declare function AutocompleteValue(props: AutocompleteValueProps): ReactElement;

export declare type AutocompleteValueProps = AutocompletePrimitive.Value.Props;

export declare type AutocompleteValueState = AutocompletePrimitive.Value.State;

export declare const Avatar: {
    Fallback: typeof AvatarFallback;
    Image: typeof AvatarImage;
    Root: typeof AvatarRoot;
};

export declare function AvatarFallback({ children, className, headingProps, ...props }: AvatarFallbackProps): ReactElement;

export declare namespace AvatarFallback {
    export type State = AvatarPrimitive.Fallback.State;
    export type Props = AvatarFallbackProps;
}

export declare interface AvatarFallbackProps extends AvatarPrimitive.Fallback.Props {
    headingProps?: Omit<HeadingProps, 'children' | 'size'>;
}

export declare function AvatarImage({ className, crossOrigin, onLoadingStatusChange, referrerPolicy, render, sizes, src, srcSet, ...props }: AvatarImageProps): ReactElement;

export declare namespace AvatarImage {
    export type State = AvatarPrimitive.Image.State;
    export type Props = AvatarImageProps;
}

export declare type AvatarImageProps = AvatarPrimitive.Image.Props;

export declare const AvatarMenu: AvatarMenuNamespace;

export declare function AvatarMenuContent({ className, render, style, ...props }: AvatarMenuContentProps): ReactElement;

export declare type AvatarMenuContentProps = NavigationMenu.Content.Props;

export declare type AvatarMenuContentState = NavigationMenu.Content.State;

export declare function AvatarMenuGroup({ children, render, stripesProps, ...props }: AvatarMenuGroupProps): ReactElement;

export declare function AvatarMenuGroupLabel({ children, className, id, render, style, ...props }: AvatarMenuGroupLabelProps): ReactElement;

export declare type AvatarMenuGroupLabelProps = Omit<PopupSurfaceGroupLabelProps, 'children' | 'className' | 'render' | 'style'> & {
    children: ReactNode;
    className?: string | ((state: AvatarMenuGroupLabelState) => string | undefined);
    render?: ReactElement | ((props: ComponentPropsWithRef<'div'>, state: AvatarMenuGroupLabelState) => ReactElement);
    style?: CSSProperties | ((state: AvatarMenuGroupLabelState) => CSSProperties | undefined);
};

export declare type AvatarMenuGroupLabelState = Record<string, never>;

export declare type AvatarMenuGroupProps = Omit<PopupSurfaceGroupProps, 'aria-labelledby' | 'role'> & {
    stripesProps?: boolean | AvatarMenuGroupStripesProps;
};

export declare type AvatarMenuGroupState = Record<string, never>;

export declare type AvatarMenuGroupStripesProps = Omit<StripesProps, 'aria-hidden' | 'aria-labelledby' | 'children' | 'dangerouslySetInnerHTML' | 'hidden' | 'inert' | 'render' | 'role'>;

export declare function AvatarMenuItem({ value, ...props }: AvatarMenuItemProps): ReactElement;

export declare type AvatarMenuItemProps = NavigationMenu.Item.Props;

export declare type AvatarMenuItemState = NavigationMenu.Item.State;

export declare function AvatarMenuLink({ children, className, closeOnClick, icon, render, style, ...props }: AvatarMenuLinkProps): ReactElement;

export declare type AvatarMenuLinkProps = NavigationMenu.Link.Props & {
    icon: PopupSurfaceItemIcon;
};

export declare type AvatarMenuLinkState = NavigationMenu.Link.State;

export declare function AvatarMenuList({ className, ...props }: AvatarMenuListProps): ReactElement;

export declare type AvatarMenuListProps = NavigationMenu.List.Props;

export declare type AvatarMenuListState = NavigationMenu.List.State;

export declare interface AvatarMenuNamespace {
    Content: typeof AvatarMenuContent;
    Group: typeof AvatarMenuGroup;
    GroupLabel: typeof AvatarMenuGroupLabel;
    Item: typeof AvatarMenuItem;
    Link: typeof AvatarMenuLink;
    List: typeof AvatarMenuList;
    Popup: typeof AvatarMenuPopup;
    Portal: typeof AvatarMenuPortal;
    Positioner: typeof AvatarMenuPositioner;
    Root: typeof AvatarMenuRoot;
    Trigger: typeof AvatarMenuTrigger;
    Viewport: typeof AvatarMenuViewport;
}

export declare function AvatarMenuPopup({ children, className, render, style, ...props }: AvatarMenuPopupProps): ReactElement;

export declare type AvatarMenuPopupProps = NavigationMenu.Popup.Props;

export declare type AvatarMenuPopupState = NavigationMenu.Popup.State;

export declare function AvatarMenuPortal(props: AvatarMenuPortalProps): ReactElement;

export declare type AvatarMenuPortalProps = NavigationMenu.Portal.Props;

export declare type AvatarMenuPortalState = NavigationMenu.Portal.State;

export declare function AvatarMenuPositioner({ anchor, className, collisionPadding, ...props }: AvatarMenuPositionerProps): ReactElement;

export declare type AvatarMenuPositionerProps = Omit<NavigationMenu.Positioner.Props, 'align' | 'side' | 'sideOffset'>;

export declare type AvatarMenuPositionerState = NavigationMenu.Positioner.State;

export declare function AvatarMenuRoot({ children, defaultValue, onOpenChangeComplete, onValueChange, orientation, ref, value, ...props }: AvatarMenuRootProps): ReactElement;

export declare type AvatarMenuRootActions = NavigationMenu.Root.Actions;

export declare type AvatarMenuRootChangeEventDetails = NavigationMenu.Root.ChangeEventDetails;

export declare type AvatarMenuRootChangeEventReason = NavigationMenu.Root.ChangeEventReason;

export declare type AvatarMenuRootProps = Omit<NavigationMenu.Root.Props, 'delay'>;

export declare type AvatarMenuRootState = NavigationMenu.Root.State;

export declare type AvatarMenuRootValue = NavigationMenu.Root.Value;

export declare function AvatarMenuTrigger({ active, children, className, style, ...props }: AvatarMenuTriggerProps): ReactElement;

export declare type AvatarMenuTriggerProps = Omit<NavigationMenu.Trigger.Props, 'aria-label' | 'nativeButton' | 'render'> & {
    active?: boolean;
    'aria-label': string;
};

export declare type AvatarMenuTriggerState = NavigationMenu.Trigger.State;

export declare function AvatarMenuViewport({ className, ...props }: AvatarMenuViewportProps): ReactElement;

export declare type AvatarMenuViewportProps = NavigationMenu.Viewport.Props;

export declare type AvatarMenuViewportState = NavigationMenu.Viewport.State;

export { AvatarPrimitive }

export declare type AvatarRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'contentMode' | 'render' | 'scale'>;

export declare function AvatarRoot({ children, className, revealAnimationProps, size, style, ...props }: AvatarRootProps): ReactElement;

export declare namespace AvatarRoot {
    export type State = AvatarPrimitive.Root.State;
    export type Props = AvatarRootProps;
}

export declare interface AvatarRootProps extends AvatarPrimitive.Root.Props {
    revealAnimationProps?: boolean | AvatarRevealAnimationProps;
    size?: AvatarSize;
}

export declare type AvatarSize = HeadingSize;

export declare function Badge({ className, variant, size, render, ...props }: BadgeProps): default_2.ReactElement;

export declare interface BadgeProps extends useRender.ComponentProps<'span'> {
    variant?: VariantProps<typeof badgeVariants>['variant'];
    size?: VariantProps<typeof badgeVariants>['size'];
}

export declare const badgeVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
    variant?: "default" | "error" | "info" | "success" | "warning" | "destructive" | "outline" | "secondary" | null | undefined;
} & ClassProp) | undefined) => string;

export declare const BottomSheet: BottomSheetNamespace;

export declare function BottomSheetBackdrop({ className, ...props }: BottomSheetBackdropProps): ReactElement;

export declare type BottomSheetBackdropProps = Omit<DrawerPrimitive.Backdrop.Props, 'forceRender'>;

export declare type BottomSheetBackdropState = DrawerPrimitive.Backdrop.State;

export declare function BottomSheetClose(props: BottomSheetCloseProps): ReactElement;

export declare type BottomSheetCloseProps = DrawerPrimitive.Close.Props;

export declare type BottomSheetCloseState = DrawerPrimitive.Close.State;

export declare function BottomSheetContent({ className, ...props }: BottomSheetContentProps): ReactElement;

export declare type BottomSheetContentProps = DrawerPrimitive.Content.Props;

export declare type BottomSheetContentState = DrawerPrimitive.Content.State;

export declare function BottomSheetDescription(props: BottomSheetDescriptionProps): ReactElement;

export declare type BottomSheetDescriptionProps = DrawerPrimitive.Description.Props;

export declare type BottomSheetDescriptionState = DrawerPrimitive.Description.State;

export declare interface BottomSheetNamespace {
    Backdrop: typeof BottomSheetBackdrop;
    Close: typeof BottomSheetClose;
    Content: typeof BottomSheetContent;
    Description: typeof BottomSheetDescription;
    Popup: typeof BottomSheetPopup;
    Portal: typeof BottomSheetPortal;
    Root: typeof BottomSheetRoot;
    Surface: typeof BottomSheetSurface;
    Title: typeof BottomSheetTitle;
    Trigger: typeof BottomSheetTrigger;
    Viewport: typeof BottomSheetViewport;
}

export declare function BottomSheetPopup({ children, className, hidden: _hidden, initialFocus, ref, render, role: _role, ...props }: BottomSheetPopupProps): ReactElement;

export declare type BottomSheetPopupProps = DrawerPrimitive.Popup.Props;

export declare type BottomSheetPopupState = DrawerPrimitive.Popup.State;

export declare function BottomSheetPortal({ className, ...props }: BottomSheetPortalProps): ReactElement;

export declare type BottomSheetPortalProps = Omit<DrawerPrimitive.Portal.Props, 'container'>;

export declare type BottomSheetPortalState = DrawerPrimitive.Portal.State;

export declare function BottomSheetRoot({ children, ...props }: BottomSheetRootProps): ReactElement;

export declare type BottomSheetRootChangeEventDetails = DrawerPrimitive.Root.ChangeEventDetails;

export declare type BottomSheetRootChangeEventReason = DrawerPrimitive.Root.ChangeEventReason;

export declare interface BottomSheetRootProps {
    children?: ReactNode;
    defaultOpen?: boolean;
    disablePointerDismissal?: boolean;
    onOpenChange?: (open: boolean, eventDetails: BottomSheetRootChangeEventDetails) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    open?: boolean;
}

export declare type BottomSheetRootState = DrawerPrimitive.Root.State;

export declare function BottomSheetSurface({ className, ...props }: BottomSheetSurfaceProps): ReactElement;

export declare type BottomSheetSurfaceProps = DrawerPrimitive.Indent.Props;

export declare type BottomSheetSurfaceState = DrawerPrimitive.Indent.State;

export declare function BottomSheetTitle(props: BottomSheetTitleProps): ReactElement;

export declare type BottomSheetTitleProps = DrawerPrimitive.Title.Props;

export declare type BottomSheetTitleState = DrawerPrimitive.Title.State;

export declare function BottomSheetTrigger(props: BottomSheetTriggerProps): ReactElement;

export declare type BottomSheetTriggerProps = Omit<DrawerPrimitive.Trigger.Props, 'handle' | 'payload'>;

export declare type BottomSheetTriggerState = DrawerPrimitive.Trigger.State;

export declare function BottomSheetViewport({ className, ...props }: BottomSheetViewportProps): ReactElement;

export declare type BottomSheetViewportProps = DrawerPrimitive.Viewport.Props;

export declare type BottomSheetViewportState = DrawerPrimitive.Viewport.State;

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

export declare function Button({ append, 'aria-busy': ariaBusy, children, className, disabled, focusableWhenDisabled, loading, nativeButton, prepend, revealAnimation, render, size, variant, ...props }: ButtonProps): ReactElement;

declare function Button_3({ className, variant, size, render, children, loading, disabled: disabledProp, ...props }: ButtonProps_2): React_2.ReactElement;

declare const BUTTON_HEADING_SIZE_NAMES: {
    readonly '2xl': "lg";
    readonly '3xl': "xl";
    readonly 'icon-2xl': "lg";
    readonly 'icon-3xl': "xl";
    readonly 'icon-lg': "sm";
    readonly 'icon-md': "xs";
    readonly 'icon-sm': "xs";
    readonly 'icon-xl': "md";
    readonly 'icon-xs': "xs";
    readonly lg: "sm";
    readonly md: "xs";
    readonly sm: "xs";
    readonly xl: "md";
    readonly xs: "xs";
};

export declare function buttonChromeHeadingSize(size?: ButtonSize): (typeof BUTTON_HEADING_SIZE_NAMES)[ButtonSize];

export declare interface ButtonChromeOptions {
    size?: ButtonSize;
    variant?: ButtonVariant;
}

export declare function buttonChromeVariants({ size, variant }?: ButtonChromeOptions): string;

export declare interface ButtonProps extends Button_2.Props {
    append?: ReactNode;
    loading?: boolean;
    prepend?: ReactNode;
    revealAnimation?: boolean | ButtonRevealAnimationProps;
    size?: ButtonSize;
    variant?: ButtonVariant;
}

declare interface ButtonProps_2 extends useRender.ComponentProps<'button'> {
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
    loading?: boolean;
}

export declare type ButtonRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'render'>;

export declare type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'icon-xs' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl' | 'icon-2xl' | 'icon-3xl';

export declare type ButtonVariant = 'default' | 'ghost' | 'link';

declare const buttonVariants: (props?: ({
    size?: "default" | "sm" | "lg" | "icon" | "icon-lg" | "icon-sm" | "icon-xl" | "icon-xs" | "xl" | "xs" | null | undefined;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "destructive-outline" | "ghost" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function Calendar({ className, classNames, showOutsideDays, components: userComponents, mode, ...props }: React_2.ComponentProps<typeof DayPicker>): React_2.ReactElement;

export declare const Card: CardNamespace;

export declare function CardAction({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardButton(props: CardButtonProps): ReactElement;

export declare type CardButtonProps = Omit<ButtonProps, 'size'>;

export declare function CardContent({ className, ...props }: CardContentProps): ReactElement;

export declare type CardContentProps = ComponentPropsWithRef<'div'>;

export declare function CardDescription({ size, tone, ...props }: CardDescriptionProps): ReactElement;

export declare type CardDescriptionProps = TextProps;

export declare function CardFooter({ className, ...props }: CardFooterProps): ReactElement;

export declare type CardFooterProps = ComponentPropsWithRef<'div'>;

export declare function CardFrame({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameAction({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameDescription({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameFooter({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameHeader({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardFrameTitle({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function CardGroup<TValue>(props: CardGroupProps<TValue>): ReactElement;

export declare type CardGroupChangeEventDetails = RadioGroupPrimitive.ChangeEventDetails;

export declare type CardGroupChangeEventReason = RadioGroupPrimitive.ChangeEventReason;

export declare type CardGroupProps<TValue> = RadioGroupPrimitive.Props<TValue>;

export declare type CardGroupState = RadioGroupPrimitive.State;

export declare function CardHeader({ className, ...props }: CardHeaderProps): ReactElement;

export declare type CardHeaderProps = ComponentPropsWithRef<'div'>;

export declare interface CardNamespace {
    Button: typeof CardButton;
    Content: typeof CardContent;
    Description: typeof CardDescription;
    Footer: typeof CardFooter;
    Group: typeof CardGroup;
    Header: typeof CardHeader;
    Root: typeof CardRoot;
    Selector: typeof CardSelector;
    Surface: typeof CardSurface;
    Title: typeof CardTitle;
    Visual: typeof CardVisual;
}

export declare function CardPanel({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare const CardPicker: CardPickerNamespace;

export declare function CardPickerCard<TValue extends CardPickerValue = string, TSelectorProps extends CardPickerSelectorProps<TValue> = CardPickerSelectorProps<TValue>>({ children, className, hint: _hint, selectorProps, value, ...props }: Omit<CardPickerCardProps<TValue>, 'selectorProps'> & {
    selectorProps: TSelectorProps;
}): ReactElement;

export declare type CardPickerCardHint = Omit<HintItem, 'condition' | 'key'>;

export declare type CardPickerCardProps<TValue extends CardPickerValue = string> = Omit<CardRootProps, 'children'> & {
    children: ReactElement<CardSurfaceProps>;
    hint: CardPickerCardHint;
    selectorProps: CardPickerSelectorProps<TValue>;
    value: TValue;
};

export declare function CardPickerGroup({ 'aria-describedby': ariaDescribedBy, className, ...props }: CardPickerGroupProps): ReactElement;

export declare type CardPickerGroupProps = Omit<CardGroupProps<CardPickerValue>, 'defaultValue' | 'disabled' | 'form' | 'inputRef' | 'name' | 'onValueChange' | 'readOnly' | 'required' | 'value'>;

export declare type CardPickerGroupState = CardGroupState;

export declare function CardPickerHint(props: CardPickerHintProps): ReactElement | null;

export declare type CardPickerHintProps = Omit<HintProps, 'hints' | 'waitingKey'>;

export declare interface CardPickerNamespace {
    Card: typeof CardPickerCard;
    Group: typeof CardPickerGroup;
    Hint: typeof CardPickerHint;
    Root: typeof CardPickerRoot;
}

export declare type CardPickerPlacement = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';

export declare function CardPickerRoot<TValue extends CardPickerValue = string>({ children, className, defaultValue, disabled, form, inputRef, name, onValueChange, placement, readOnly, render, required, style, value, ...props }: CardPickerRootProps<TValue>): ReactElement | null;

export declare type CardPickerRootChangeEventDetails = CardGroupChangeEventDetails;

export declare type CardPickerRootChangeEventReason = CardGroupChangeEventReason;

export declare type CardPickerRootProps<TValue extends CardPickerValue = string> = Omit<useRender.ComponentProps<'div', CardPickerRootState<TValue>>, 'children' | 'className' | 'style'> & {
    children: ReactNode;
    className?: string | ((state: CardPickerRootState<TValue>) => string | undefined);
    defaultValue?: TValue;
    disabled?: boolean;
    form?: string;
    inputRef?: Ref<HTMLInputElement>;
    name?: string;
    onValueChange?: (value: TValue, eventDetails: CardPickerRootChangeEventDetails) => void;
    placement?: CardPickerPlacement;
    readOnly?: boolean;
    required?: boolean;
    style?: CSSProperties | ((state: CardPickerRootState<TValue>) => CSSProperties | undefined);
    value?: TValue | null;
};

export declare interface CardPickerRootState<TValue extends CardPickerValue = string> {
    disabled: boolean;
    placement: CardPickerPlacement;
    readOnly: boolean;
    required: boolean;
    value: TValue | null;
}

export declare type CardPickerSelectorProps<TValue extends CardPickerValue = string> = Omit<CardSelectorProps<TValue>, 'value'>;

export declare type CardPickerValue = Key;

export declare function CardRoot({ className, render, size, style, ...props }: CardRootProps): ReactElement | null;

export declare interface CardRootProps extends Omit<useRender.ComponentProps<'div', CardRootState>, 'className' | 'style'> {
    className?: string | ((state: CardRootState) => string | undefined);
    size?: CardSize;
    style?: CSSProperties | ((state: CardRootState) => CSSProperties | undefined);
}

export declare interface CardRootState {
    disabled: boolean;
    readOnly: boolean;
    selectable: boolean;
    selected: boolean;
    size: CardSize;
}

export declare function CardSelector<TValue>(props: CardSelectorProps<TValue>): ReactElement;

export declare type CardSelectorProps<TValue> = Omit<RadioPrimitive.Root.Props<TValue>, 'children'>;

export declare type CardSelectorState = RadioPrimitive.Root.State;

export declare type CardSize = 'xs' | 'md' | 'xl';

export declare function CardSurface({ children, className, render, style, ...props }: CardSurfaceProps): ReactElement | null;

export declare type CardSurfaceProps = Omit<useRender.ComponentProps<'div', CardSurfaceState>, 'className' | 'id' | 'ref' | 'style'> & {
    children?: ReactNode;
    className?: string | ((state: CardSurfaceState) => string | undefined);
    style?: CSSProperties | ((state: CardSurfaceState) => CSSProperties | undefined);
};

export declare interface CardSurfaceState {
    disabled: boolean;
    readOnly: boolean;
    selectable: boolean;
    selected: boolean;
    size: CardSize;
}

export declare function CardTitle({ size, ...props }: CardTitleProps): ReactElement;

export declare type CardTitleProps = HeadingProps;

export declare function CardVisual({ children, className, icon, placement, stripesProps, ...props }: CardVisualProps): ReactElement;

export declare type CardVisualPlacement = 'flow' | 'overlay';

export declare interface CardVisualProps extends ComponentPropsWithRef<'div'> {
    icon?: ReactNode;
    placement?: CardVisualPlacement;
    stripesProps?: boolean | CardVisualStripesProps;
}

export declare type CardVisualStripesProps = Omit<StripesProps, 'aria-hidden' | 'children' | 'render'>;

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

export declare function ComboboxPopup({ className, children, side, sideOffset, alignOffset, align, anchor: anchorProp, portalProps, ...props }: ComboboxPrimitive.Popup.Props & {
    align?: ComboboxPrimitive.Positioner.Props['align'];
    sideOffset?: ComboboxPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: ComboboxPrimitive.Positioner.Props['alignOffset'];
    side?: ComboboxPrimitive.Positioner.Props['side'];
    anchor?: ComboboxPrimitive.Positioner.Props['anchor'];
    portalProps?: ComboboxPrimitive.Portal.Props;
}): React_2.ReactElement;

export { ComboboxPrimitive }

export declare function ComboboxRow({ className, ...props }: ComboboxPrimitive.Row.Props): React_2.ReactElement;

export declare function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props): React_2.ReactElement;

export declare function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props): React_2.ReactElement;

export declare function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props): React_2.ReactElement;

export declare function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props): React_2.ReactElement;

export declare function Command({ autoHighlight, keepHighlight, ...props }: React_2.ComponentProps<typeof Autocomplete_2>): React_2.ReactElement;

export declare function CommandCollection({ ...props }: React_2.ComponentProps<typeof AutocompleteCollection_2>): React_2.ReactElement;

export declare const CommandCreateHandle: typeof Dialog_2.createHandle;

export declare const CommandDialog: typeof Dialog_2.Root;

export declare function CommandDialogBackdrop({ className, ...props }: Dialog_2.Backdrop.Props): React_2.ReactElement;

export declare function CommandDialogPopup({ className, children, portalProps, ...props }: Dialog_2.Popup.Props & {
    portalProps?: Dialog_2.Portal.Props;
}): React_2.ReactElement;

export declare const CommandDialogPortal: typeof Dialog_2.Portal;

export declare function CommandDialogTrigger(props: Dialog_2.Trigger.Props): React_2.ReactElement;

export declare function CommandDialogViewport({ className, ...props }: Dialog_2.Viewport.Props): React_2.ReactElement;

export declare function CommandEmpty({ className, ...props }: React_2.ComponentProps<typeof AutocompleteEmpty_2>): React_2.ReactElement;

export declare function CommandFooter({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function CommandGroup({ className, ...props }: React_2.ComponentProps<typeof AutocompleteGroup_2>): React_2.ReactElement;

export declare function CommandGroupLabel({ className, ...props }: React_2.ComponentProps<typeof AutocompleteGroupLabel_2>): React_2.ReactElement;

export declare function CommandInput({ className, placeholder, ...props }: React_2.ComponentProps<typeof AutocompleteInput_2>): React_2.ReactElement;

export declare function CommandItem({ className, ...props }: React_2.ComponentProps<typeof AutocompleteItem_2>): React_2.ReactElement;

export declare function CommandList({ className, ...props }: React_2.ComponentProps<typeof AutocompleteList_2>): React_2.ReactElement;

export declare function CommandPanel({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function CommandSeparator({ className, ...props }: React_2.ComponentProps<typeof AutocompleteSeparator_2>): React_2.ReactElement;

export declare function CommandShortcut({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare const Components: ComponentsNamespace;

export declare interface ComponentsNamespace {
    AspectRatio: typeof AspectRatio;
    Autocomplete: typeof Autocomplete;
    Avatar: typeof Avatar;
    AvatarMenu: typeof AvatarMenu;
    Button: typeof Button;
    BottomSheet: typeof BottomSheet;
    Card: typeof Card;
    CardPicker: typeof CardPicker;
    Field: typeof Field;
    Heading: typeof Heading;
    Hint: typeof Hint;
    Input: typeof Input;
    LoadingCover: typeof LoadingCover;
    PopupSurface: typeof PopupSurface;
    Rails: typeof Rails;
    ScrollArea: typeof ScrollArea;
    Stripes: typeof Stripes;
    Tabs: typeof Tabs;
    Text: typeof Text_2;
    Tiles: typeof Tiles;
}

export declare function CursorGrowIcon(props: React_2.ComponentProps<'svg'>): React_2.ReactElement;

export declare const Dialog: typeof Dialog_2.Root;

export { Dialog_2 as CommandDialogPrimitive }
export { Dialog_2 as DialogPrimitive }
export { Dialog_2 as SheetPrimitive }

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

declare function DialogPopup({ className, children, showCloseButton, bottomStickOnMobile, closeProps, portalProps, ...props }: Dialog_2.Popup.Props & {
    showCloseButton?: boolean;
    bottomStickOnMobile?: boolean;
    closeProps?: Dialog_2.Close.Props;
    portalProps?: Dialog_2.Portal.Props;
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

export declare const DRAWER_ANIMATION_DELAY = 450;

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

export declare function DrawerIndent({ className, ...props }: DrawerPrimitive.Indent.Props): default_2.ReactElement;

export declare function DrawerIndentBackground({ className, ...props }: DrawerPrimitive.IndentBackground.Props): default_2.ReactElement;

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

export declare function DrawerPopup({ className, children, showCloseButton, position: positionProp, variant, showBar, portalProps, ...props }: DrawerPrimitive.Popup.Props & {
    showCloseButton?: boolean;
    position?: DrawerPosition;
    variant?: 'default' | 'straight' | 'inset';
    showBar?: boolean;
    portalProps?: DrawerPrimitive.Portal.Props;
}): default_2.ReactElement;

export declare const DrawerPortal: typeof DrawerPrimitive.Portal;

declare type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';

export { DrawerPrimitive }

export declare function DrawerProvider(props: DrawerPrimitive.Provider.Props): default_2.ReactElement;

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

export declare const FADE_ANIMATION_TRANSITION_SECONDS = 0.2;

export declare function FadeAnimation({ children, show, className, duration }: FadeAnimationProps): JSX.Element;

export declare interface FadeAnimationProps {
    children: ReactNode;
    show: boolean;
    className?: string;
    duration?: number;
}

export declare const Field: FieldNamespace;

export declare function FieldControl({ addOn, children: _children, inputAddOnProps, inputRootProps, ref, required: _required, ...props }: FieldControlProps & {
    children?: unknown;
    required?: unknown;
}): ReactElement;

export declare type FieldControlChangeEventDetails = InputControlChangeEventDetails;

export declare type FieldControlChangeEventReason = InputControlChangeEventReason;

declare type FieldControlDataAttributes = Partial<Record<`data-${string}`, string | number | boolean>>;

export declare type FieldControlInputAddOnProps = Omit<InputAddOnProps, 'children'>;

export declare type FieldControlInputRootProps = Omit<InputRootProps, 'children'>;

export declare type FieldControlProps = Omit<InputControlProps, 'children' | 'ref' | 'required'> & RefAttributes<HTMLElement> & {
    addOn: ReactElement;
    inputAddOnProps?: FieldControlInputAddOnProps & FieldControlDataAttributes;
    inputRootProps?: FieldControlInputRootProps & FieldControlDataAttributes;
    required?: never;
};

export declare type FieldControlState = InputControlState;

export declare function FieldDescription({ children: _children, getErrorKey, hints: _hints, intent: _intent, render, stripesOptions, switchAnimationOptions, textProps, tone: _tone, waitingContent, waitingKey, ...props }: FieldDescriptionProps & {
    children?: unknown;
    hints?: unknown;
    intent?: unknown;
    tone?: unknown;
}): ReactElement;

export declare type FieldDescriptionGetErrorKey = (error: string, index: number, errors: readonly string[]) => Key;

export declare interface FieldDescriptionProps extends Omit<useRender.ComponentProps<'div', FieldDescriptionState>, 'children' | 'className' | 'ref' | 'render' | 'style'>, RefAttributes<HTMLElement> {
    className?: string | ((state: FieldDescriptionState) => string | undefined);
    getErrorKey?: FieldDescriptionGetErrorKey;
    render?: ReactElement | ((props: ComponentPropsWithRef<'div'>, state: FieldDescriptionState) => ReactElement);
    stripesOptions?: FieldDescriptionStripesOptions;
    style?: CSSProperties | ((state: FieldDescriptionState) => CSSProperties | undefined);
    switchAnimationOptions?: FieldDescriptionSwitchAnimationOptions;
    textProps?: FieldDescriptionTextProps;
    waitingContent: HintContent;
    waitingKey: Key;
}

export declare type FieldDescriptionState = FieldPrimitive.Description.State;

export declare type FieldDescriptionStripesOptions = HintStripesOptions;

export declare type FieldDescriptionSwitchAnimationOptions = HintSwitchAnimationOptions;

export declare type FieldDescriptionTextProps = Pick<HintTextProps, 'className' | 'size' | 'style'>;

export declare function FieldItem(props: FieldItemProps): ReactElement;

export declare type FieldItemProps = FieldPrimitive.Item.Props;

export declare type FieldItemState = FieldPrimitive.Item.State;

export declare function FieldLabel(props: FieldLabelProps | FieldLabelComponentProps): ReactElement;

declare type FieldLabelBaseRender = Exclude<FieldPrimitive.Label.Props['render'], ReactElement | undefined>;

declare type FieldLabelClassNameCallback = ((state: FieldLabelState) => string | undefined) & {
    bivarianceHack(state: FieldPrimitive.Label.State): string | undefined;
}['bivarianceHack'];

declare interface FieldLabelComponentProps extends Omit<FieldLabelProps, 'ref'>, RefAttributes<HTMLElement> {
}

export declare type FieldLabelHeadingProps = ToneOrIntentProps;

export declare interface FieldLabelProps extends Omit<FieldPrimitive.Label.Props, 'className' | 'render' | 'style'> {
    className?: string | FieldLabelClassNameCallback;
    headingProps?: FieldLabelHeadingProps;
    render?: ReactElement | FieldLabelRenderCallback;
    style?: CSSProperties | FieldLabelStyleCallback;
}

declare type FieldLabelRenderCallback = ((props: ComponentPropsWithRef<'label'>, state: FieldLabelState) => ReactElement) & {
    bivarianceHack(props: Parameters<FieldLabelBaseRender>[0], state: FieldPrimitive.Label.State): ReactElement;
}['bivarianceHack'];

export declare type FieldLabelState = FieldPrimitive.Label.State & {
    required: boolean;
};

declare type FieldLabelStyleCallback = ((state: FieldLabelState) => CSSProperties | undefined) & {
    bivarianceHack(state: FieldPrimitive.Label.State): CSSProperties | undefined;
}['bivarianceHack'];

export declare interface FieldNamespace {
    Control: typeof FieldControl;
    Description: typeof FieldDescription;
    Item: typeof FieldItem;
    Label: typeof FieldLabel;
    Root: typeof FieldRoot;
    Validity: typeof FieldValidity;
}

export { FieldPrimitive }

export declare function FieldRoot(props: FieldRootProps): ReactElement;

export declare type FieldRootActions = FieldPrimitive.Root.Actions;

declare type FieldRootBaseRender = Exclude<FieldPrimitive.Root.Props['render'], ReactElement | undefined>;

declare type FieldRootClassNameCallback = ((state: FieldRootState) => string | undefined) & {
    bivarianceHack(state: FieldPrimitive.Root.State): string | undefined;
}['bivarianceHack'];

export declare interface FieldRootProps extends Omit<FieldPrimitive.Root.Props, 'className' | 'render' | 'style'> {
    className?: string | FieldRootClassNameCallback;
    render?: ReactElement | FieldRootRenderCallback;
    required?: boolean;
    style?: CSSProperties | FieldRootStyleCallback;
}

declare type FieldRootRenderCallback = ((props: ComponentPropsWithRef<'div'>, state: FieldRootState) => ReactElement) & {
    bivarianceHack(props: Parameters<FieldRootBaseRender>[0], state: FieldPrimitive.Root.State): ReactElement;
}['bivarianceHack'];

export declare type FieldRootState = FieldPrimitive.Root.State & {
    required: boolean;
};

declare type FieldRootStyleCallback = ((state: FieldRootState) => CSSProperties | undefined) & {
    bivarianceHack(state: FieldPrimitive.Root.State): CSSProperties | undefined;
}['bivarianceHack'];

export declare function Fieldset({ className, ...props }: FieldsetPrimitive.Root.Props): default_2.ReactElement;

export declare function FieldsetLegend({ className, ...props }: FieldsetPrimitive.Legend.Props): default_2.ReactElement;

export { FieldsetPrimitive }

export declare type FieldSize = 'xs' | 'md' | 'xl';

export declare function FieldValidity(props: FieldValidityProps): ReactElement;

export declare type FieldValidityData = FieldPrimitive.ValidityData;

export declare type FieldValidityProps = FieldPrimitive.Validity.Props;

export declare type FieldValidityState = FieldPrimitive.Validity.State;

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

export declare function Heading({ className, intent, render, size, tone, ...props }: HeadingProps): ReactElement;

export declare type HeadingProps = useRender.ComponentProps<'span', Record<string, never>> & ToneOrIntentProps & {
    size?: HeadingSize;
};

export declare type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export declare function Hint({ hints, render, stripesOptions, switchAnimationOptions, textProps, waitingContent, waitingKey, ...props }: HintProps): ReactElement | null;

export declare type HintContent = string | ReactElement;

export declare interface HintItem {
    readonly condition: boolean;
    readonly content: HintContent;
    readonly key: Key;
}

export declare interface HintProps extends Omit<useRender.ComponentProps<'div', Record<string, never>>, 'children'> {
    hints: readonly HintItem[];
    stripesOptions?: HintStripesOptions;
    switchAnimationOptions?: HintSwitchAnimationOptions;
    textProps?: HintTextProps;
    waitingContent: HintContent;
    waitingKey: Key;
}

export declare type HintStripesOptions = Pick<StripesProps, 'angle' | 'className' | 'color' | 'gap' | 'style' | 'width'>;

export declare type HintSwitchAnimationOptions = Pick<SwitchAnimationProps, 'className' | 'direction' | 'onSwitchChange' | 'onSwitchComplete' | 'onSwitchStart' | 'style'>;

export declare type HintTextProps = Pick<TextProps, 'className' | 'size' | 'style'> & ToneOrIntentProps;

export declare function HorizontalPanel<Value = unknown>({ children, className, collapsible, style, ...props }: HorizontalPanelProps<Value>): default_2.ReactElement;

export declare function HorizontalPanelContent({ className, children, ...props }: AccordionPrimitive.Panel.Props): default_2.ReactElement;

export declare function HorizontalPanelItem({ className, ...props }: AccordionPrimitive.Item.Props): default_2.ReactElement;

export declare interface HorizontalPanelProps<Value = unknown> extends AccordionPrimitive.Root.Props<Value> {
    collapsible?: boolean;
}

export declare function HorizontalPanelTrigger({ className, children, onClick, ...props }: AccordionPrimitive.Trigger.Props): default_2.ReactElement;

export { ImageLoadingStatus }

export declare const Input: InputNamespace;

declare function Input_2({ className, size, unstyled, nativeInput, ...props }: InputProps): React_2.ReactElement;

export declare function InputAddOn({ children, className, position, ref, style, ...props }: InputAddOnProps): ReactElement;

declare type InputAddOnAriaProp = Extract<keyof ComponentPropsWithRef<'span'>, `aria-${string}`>;

declare type InputAddOnEventProp = Extract<keyof ComponentPropsWithRef<'span'>, `on${string}`>;

declare type InputAddOnInteractiveProp = 'accessKey' | 'autoFocus' | 'contentEditable' | 'contextMenu' | 'dangerouslySetInnerHTML' | 'draggable' | 'inert' | 'popover' | 'popoverTarget' | 'popoverTargetAction' | 'role' | 'suppressContentEditableWarning' | 'tabIndex' | 'title';

export declare type InputAddOnPosition = 'start' | 'end';

export declare type InputAddOnProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'style' | InputAddOnAriaProp | InputAddOnEventProp | InputAddOnInteractiveProp> & {
    children: ReactElement;
    position?: InputAddOnPosition;
    style?: Omit<CSSProperties, 'pointerEvents'>;
};

export declare function InputControl(props: Omit<InputControlProps, 'ref'> & RefAttributes<HTMLElement>): ReactElement;

export declare type InputControlChangeEventDetails = InputPrimitive.ChangeEventDetails;

export declare type InputControlChangeEventReason = InputPrimitive.ChangeEventReason;

export declare interface InputControlProps extends InputPrimitive.Props {
}

export declare type InputControlState = InputPrimitive.State;

export declare function InputGroup({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function InputGroupAddon({ className, align, ...props }: React_2.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>): React_2.ReactElement;

declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-end" | "inline-start" | "block-end" | "block-start" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function InputGroupInput({ className, ...props }: InputProps): React_2.ReactElement;

export declare function InputGroupText({ className, ...props }: React_2.ComponentProps<'span'>): React_2.ReactElement;

export declare function InputGroupTextarea({ className, ...props }: TextareaProps): React_2.ReactElement;

export declare interface InputNamespace {
    AddOn: typeof InputAddOn;
    Control: typeof InputControl;
    Root: typeof InputRoot;
}

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

export declare function InputRoot({ children, ref, size, ...props }: InputRootProps): ReactElement;

export declare interface InputRootProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
    children: ReactNode;
    size?: InputSize;
}

export declare type InputSize = FieldSize;

export declare type Intent = 'info' | 'success' | 'warning' | 'destructive';

export declare function Kbd({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare function KbdGroup({ className, ...props }: React_2.ComponentProps<'kbd'>): React_2.ReactElement;

export declare function Label({ className, render, ...props }: useRender.ComponentProps<'label'>): default_2.ReactElement;

export declare namespace LoadingCover {
    export {
        LoadingCoverCascade as Cascade,
        LoadingCoverLogo as Logo,
        LoadingCoverRoot as Root
    }
}

export declare function LoadingCoverCascade({ children, className, ref, render, style, ...props }: LoadingCoverCascadeProps): ReactElement;

export declare namespace LoadingCoverCascade {
    export type Props = LoadingCoverCascadeProps;
    export type State = LoadingCoverCascadeState;
}

export declare type LoadingCoverCascadeProps = Omit<useRender.ComponentProps<'div', LoadingCoverCascadeState>, 'className' | 'ref' | 'style'> & {
    className?: string | ((state: LoadingCoverCascadeState) => string | undefined);
    ref?: Ref<HTMLElement>;
    style?: CSSProperties | ((state: LoadingCoverCascadeState) => CSSProperties | undefined);
};

export declare interface LoadingCoverCascadeState {
    resolved: boolean;
}

export declare function LoadingCoverLogo({ variant, ...props }: LoadingCoverLogoProps): ReactElement;

export declare namespace LoadingCoverLogo {
    export type Props = LoadingCoverLogoProps;
    export type State = LoadingCoverLogoState;
}

export declare interface LoadingCoverLogoProps extends LogoIconProps {
}

export declare type LoadingCoverLogoState = Record<string, never>;

export declare interface LoadingCoverNamespace {
    Cascade: typeof LoadingCoverCascade & ComponentType<LoadingCoverCascadeProps>;
    Logo: typeof LoadingCoverLogo & ComponentType<LoadingCoverLogoProps>;
    Root: typeof LoadingCoverRoot & ComponentType<LoadingCoverRootProps>;
}

export declare type LoadingCoverRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'contentMode' | 'render' | 'reveal' | 'scale' | 'unrevealBehavior'>;

export declare function LoadingCoverRoot({ 'aria-label': statusLabel, children, className, fullscreen, loading, logo, ref, render, revealAnimationProps, style, ...props }: LoadingCoverRootProps): ReactElement;

export declare namespace LoadingCoverRoot {
    export type Props = LoadingCoverRootProps;
    export type State = LoadingCoverRootState;
}

export declare type LoadingCoverRootProps = Omit<useRender.ComponentProps<'div', LoadingCoverRootState>, 'className' | 'ref' | 'style'> & {
    'aria-label'?: string;
    className?: string | ((state: LoadingCoverRootState) => string | undefined);
    fullscreen?: boolean;
    loading: boolean;
    logo?: ReactElement | null;
    ref?: Ref<HTMLElement>;
    revealAnimationProps?: LoadingCoverRevealAnimationProps;
    style?: CSSProperties | ((state: LoadingCoverRootState) => CSSProperties | undefined);
};

export declare interface LoadingCoverRootState {
    busy: boolean;
    fullscreen: boolean;
    loading: boolean;
    visualState: LoadingCoverVisualState;
}

export declare type LoadingCoverVisualState = 'hidden' | 'revealing' | 'revealed' | 'unrevealing';

export declare function Logo({ className, variant, ...props }: LogoProps): default_2.ReactElement;

export declare function LogoIcon({ className, variant, ...props }: LogoIconProps): default_2.ReactElement;

export declare interface LogoIconProps extends VariantProps<typeof logoIconVariants>, default_2.SVGProps<SVGSVGElement> {
}

export declare const logoIconVariants: (props?: ({
    variant?: "background" | "foreground" | null | undefined;
} & ClassProp) | undefined) => string;

export declare interface LogoProps extends VariantProps<typeof logoVariants>, default_2.SVGProps<SVGSVGElement> {
}

export declare const logoVariants: (props?: ({
    variant?: "black" | "white" | null | undefined;
} & ClassProp) | undefined) => string;

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

declare function MenuPopup({ children, className, sideOffset, align, alignOffset, side, anchor, portalProps, ...props }: MenuPrimitive.Popup.Props & {
    align?: MenuPrimitive.Positioner.Props['align'];
    sideOffset?: MenuPrimitive.Positioner.Props['sideOffset'];
    alignOffset?: MenuPrimitive.Positioner.Props['alignOffset'];
    side?: MenuPrimitive.Positioner.Props['side'];
    anchor?: MenuPrimitive.Positioner.Props['anchor'];
    portalProps?: MenuPrimitive.Portal.Props;
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
    size?: React_2.ComponentProps<typeof Button_3>['size'];
} & useRender.ComponentProps<'a'>;

export declare function PaginationNext({ className, ...props }: React_2.ComponentProps<typeof PaginationLink>): React_2.ReactElement;

export declare function PaginationPrevious({ className, ...props }: React_2.ComponentProps<typeof PaginationLink>): React_2.ReactElement;

export declare const Popover: typeof PopoverPrimitive.Root;

export declare function PopoverClose({ ...props }: PopoverPrimitive.Close.Props): default_2.ReactElement;

export declare const PopoverCreateHandle: typeof PopoverPrimitive.createHandle;

export declare function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props): default_2.ReactElement;

declare function PopoverPopup({ children, className, side, align, sideOffset, alignOffset, tooltipStyle, anchor, portalProps, ...props }: PopoverPrimitive.Popup.Props & {
    portalProps?: PopoverPrimitive.Portal.Props;
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

export declare const PopupSurface: PopupSurfaceNamespace;

export declare function PopupSurfaceGroup({ className, render, style, ...props }: PopupSurfaceGroupProps): ReactElement | null;

declare type PopupSurfaceGroupBaseProps = useRender.ComponentProps<'div', PopupSurfaceGroupState, ComponentPropsWithRef<'div'>>;

export declare function PopupSurfaceGroupLabel({ className, render, style, ...props }: PopupSurfaceGroupLabelProps): ReactElement | null;

declare type PopupSurfaceGroupLabelBaseProps = useRender.ComponentProps<'div', PopupSurfaceGroupLabelState, ComponentPropsWithRef<'div'>>;

export declare type PopupSurfaceGroupLabelProps = Omit<PopupSurfaceGroupLabelBaseProps, 'className' | 'ref' | 'style'> & {
    className?: string | ((state: PopupSurfaceGroupLabelState) => string | undefined);
    ref?: Ref<HTMLElement>;
    style?: CSSProperties | ((state: PopupSurfaceGroupLabelState) => CSSProperties | undefined);
};

export declare type PopupSurfaceGroupLabelState = Record<string, never>;

export declare type PopupSurfaceGroupProps = Omit<PopupSurfaceGroupBaseProps, 'className' | 'ref' | 'style'> & {
    className?: string | ((state: PopupSurfaceGroupState) => string | undefined);
    ref?: Ref<HTMLElement>;
    style?: CSSProperties | ((state: PopupSurfaceGroupState) => CSSProperties | undefined);
};

export declare type PopupSurfaceGroupState = Record<string, never>;

export declare function PopupSurfaceItem({ children, className, contentInset, icon, iconPosition, render, reveal, revealAnimationProps, size, style, ...props }: PopupSurfaceItemProps): ReactElement | null;

declare type PopupSurfaceItemBaseProps = useRender.ComponentProps<'div', PopupSurfaceItemState, ComponentPropsWithRef<'div'>>;

export declare type PopupSurfaceItemContentInset = 'base' | 'start' | 'end';

export declare type PopupSurfaceItemIcon = ReactElement;

export declare type PopupSurfaceItemIconPosition = 'start' | 'end';

export declare type PopupSurfaceItemProps = Omit<PopupSurfaceItemBaseProps, 'className' | 'ref' | 'style'> & {
    className?: string | ((state: PopupSurfaceItemState) => string | undefined);
    contentInset?: PopupSurfaceItemContentInset;
    icon?: PopupSurfaceItemIcon;
    iconPosition?: PopupSurfaceItemIconPosition;
    reveal?: boolean;
    revealAnimationProps?: boolean | PopupSurfaceItemRevealAnimationProps;
    ref?: Ref<HTMLElement>;
    size: PopupSurfaceSize;
    style?: CSSProperties | ((state: PopupSurfaceItemState) => CSSProperties | undefined);
};

export declare type PopupSurfaceItemRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'render' | 'reveal'>;

export declare interface PopupSurfaceItemState {
    contentInset: PopupSurfaceItemContentInset;
    iconPosition: PopupSurfaceItemIconPosition;
    revealed: boolean;
    size: PopupSurfaceSize;
}

export declare interface PopupSurfaceNamespace {
    Group: typeof PopupSurfaceGroup;
    GroupLabel: typeof PopupSurfaceGroupLabel;
    Item: typeof PopupSurfaceItem;
    Root: typeof PopupSurfaceRoot;
}

export declare function PopupSurfaceRoot({ className, render, size, style, ...props }: PopupSurfaceRootProps): ReactElement | null;

declare type PopupSurfaceRootBaseProps = useRender.ComponentProps<'div', PopupSurfaceRootState, ComponentPropsWithRef<'div'>>;

export declare type PopupSurfaceRootProps = Omit<PopupSurfaceRootBaseProps, 'className' | 'ref' | 'style'> & {
    className?: string | ((state: PopupSurfaceRootState) => string | undefined);
    ref?: Ref<HTMLElement>;
    size: PopupSurfaceSize;
    style?: CSSProperties | ((state: PopupSurfaceRootState) => CSSProperties | undefined);
};

export declare interface PopupSurfaceRootState {
    size: PopupSurfaceSize;
}

export declare type PopupSurfaceSize = FieldSize;

declare const PreviewCard: typeof PreviewCardPrimitive.Root;
export { PreviewCard as HoverCard }
export { PreviewCard }

declare function PreviewCardPopup({ className, children, align, sideOffset, anchor, portalProps, ...props }: PreviewCardPrimitive.Popup.Props & {
    align?: PreviewCardPrimitive.Positioner.Props['align'];
    sideOffset?: PreviewCardPrimitive.Positioner.Props['sideOffset'];
    anchor?: PreviewCardPrimitive.Positioner.Props['anchor'];
    portalProps?: PreviewCardPrimitive.Portal.Props;
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

export declare namespace Rails {
    export {
        RailsHeader as Header,
        RailsItem as Item,
        RailsList as List,
        RailsPanel as Panel,
        RailsRail as Rail,
        RailsRoot as Root
    }
}

export declare function RailsHeader({ className, render, style, ...props }: RailsHeaderProps): ReactElement;

export declare namespace RailsHeader {
    export type State = RailsHeaderState;
    export type Props = RailsHeaderProps;
}

export declare interface RailsHeaderProps extends Omit<AccordionPrimitive.Header.Props, 'className' | 'render' | 'style'> {
    className?: string | ((state: RailsHeaderState) => string | undefined);
    render?: RailsRenderProp<RailsHeaderState>;
    style?: CSSProperties | ((state: RailsHeaderState) => CSSProperties | undefined);
}

export declare type RailsHeaderState = RailsState<AccordionPrimitive.Header.State>;

export declare function RailsItem({ className, render, style, ...props }: RailsItemProps): ReactElement;

export declare namespace RailsItem {
    export type State = RailsItemState;
    export type Props = RailsItemProps;
    export type ChangeEventReason = RailsItemChangeEventReason;
    export type ChangeEventDetails = RailsItemChangeEventDetails;
}

export declare type RailsItemChangeEventDetails = AccordionPrimitive.Item.ChangeEventDetails;

export declare type RailsItemChangeEventReason = AccordionPrimitive.Item.ChangeEventReason;

export declare interface RailsItemProps extends Omit<AccordionPrimitive.Item.Props, 'className' | 'render' | 'style'> {
    className?: string | ((state: RailsItemState) => string | undefined);
    render?: RailsRenderProp<RailsItemState>;
    style?: CSSProperties | ((state: RailsItemState) => CSSProperties | undefined);
}

export declare type RailsItemState = RailsState<AccordionPrimitive.Item.State>;

export declare function RailsList({ className, ...props }: RailsListProps): ReactElement;

export declare namespace RailsList {
    export type Props = RailsListProps;
}

export declare interface RailsListProps extends ComponentPropsWithRef<'div'> {
}

export declare type RailsOrientation = 'vertical' | 'horizontal';

export declare function RailsPanel({ className, hiddenUntilFound, keepMounted, ref, render, style, ...props }: RailsPanelProps): ReactElement;

export declare namespace RailsPanel {
    export type State = RailsPanelState;
    export type Props = RailsPanelProps;
}

export declare interface RailsPanelProps extends Omit<AccordionPrimitive.Panel.Props, 'className' | 'render' | 'style'> {
    className?: string | ((state: RailsPanelState) => string | undefined);
    render?: RailsRenderProp<RailsPanelState>;
    style?: CSSProperties | ((state: RailsPanelState) => CSSProperties | undefined);
}

export declare type RailsPanelState = RailsState<AccordionPrimitive.Panel.State>;

export declare function RailsRail({ children, className, render, style, ...props }: RailsRailProps): ReactElement;

export declare namespace RailsRail {
    export type State = RailsRailState;
    export type Props = RailsRailProps;
}

export declare interface RailsRailProps extends Omit<AccordionPrimitive.Trigger.Props, 'className' | 'render' | 'style'> {
    className?: string | ((state: RailsRailState) => string | undefined);
    render?: ReactElement | ((props: Record<string, unknown>, state: RailsRailState) => ReactElement);
    style?: CSSProperties | ((state: RailsRailState) => CSSProperties | undefined);
}

export declare type RailsRailState = RailsState<AccordionPrimitive.Trigger.State>;

declare type RailsRenderProp<TState> = ReactElement | ((props: Record<string, unknown>, state: TState) => ReactElement) | undefined;

export declare function RailsRoot<TValue = unknown>({ children, className, hiddenUntilFound, keepMounted, onValueChange, orientation, ref, render, style, ...props }: RailsRootProps<TValue>): ReactElement;

export declare namespace RailsRoot {
    export type Value<TValue = unknown> = RailsRootValue<TValue>;
    export type State<TValue = unknown> = RailsRootState<TValue>;
    export type Props<TValue = unknown> = RailsRootProps<TValue>;
    export type ChangeEventReason = RailsRootChangeEventReason;
    export type ChangeEventDetails = RailsRootChangeEventDetails;
}

export declare type RailsRootChangeEventDetails = AccordionPrimitive.Root.ChangeEventDetails;

export declare type RailsRootChangeEventReason = AccordionPrimitive.Root.ChangeEventReason;

export declare interface RailsRootProps<TValue = unknown> extends Omit<AccordionPrimitive.Root.Props<TValue>, 'className' | 'loopFocus' | 'multiple' | 'orientation' | 'render' | 'style'> {
    className?: string | ((state: RailsRootState<TValue>) => string | undefined);
    orientation?: RailsOrientation;
    render?: RailsRenderProp<RailsRootState<TValue>>;
    style?: CSSProperties | ((state: RailsRootState<TValue>) => CSSProperties | undefined);
}

export declare type RailsRootState<TValue = unknown> = RailsState<AccordionPrimitive.Root.State<TValue>>;

export declare type RailsRootValue<TValue = unknown> = AccordionPrimitive.Root.Value<TValue>;

declare type RailsState<TState extends {
    orientation: unknown;
}> = Omit<TState, 'orientation'> & {
    orientation: RailsOrientation;
};

export declare function RevealAnimation({ alignX, alignY, children, contentMode, direction, offsetX, offsetY, onRevealChange, onRevealComplete, onRevealStart, render, reveal, scale, unrevealBehavior }: RevealAnimationProps): ReactElement;

export declare type RevealAnimationAlignment = 'start' | 'center' | 'end';

export declare type RevealAnimationContentMode = 'flow' | 'phrasing';

export declare type RevealAnimationDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal-45-to-135';

export declare interface RevealAnimationProps {
    alignX?: RevealAnimationAlignment;
    alignY?: RevealAnimationAlignment;
    children?: ReactNode;
    contentMode?: RevealAnimationContentMode;
    direction?: RevealAnimationDirection;
    offsetX?: number;
    offsetY?: number;
    onRevealChange?: (revealed: boolean) => void;
    onRevealComplete?: (revealed: boolean) => void;
    onRevealStart?: (revealed: boolean) => void;
    render: ReactElement;
    reveal?: boolean;
    scale?: number;
    unrevealBehavior?: RevealAnimationUnrevealBehavior;
}

export declare type RevealAnimationUnrevealBehavior = 'return' | 'continue';

export declare function ScrollArea({ children, ...props }: ScrollAreaProps): ReactElement;

export { ScrollAreaPrimitive }

export declare interface ScrollAreaProps extends Omit<ScrollAreaPrimitive.Root.Props, 'children'> {
    children: ReactNode;
}

export declare function ScrollBar({ className, orientation, ...props }: ScrollAreaPrimitive.Scrollbar.Props): default_2.ReactElement;

export declare const Select: typeof SelectPrimitive.Root;

export declare function SelectableGrid<TItem extends SelectableGridItem>({ allowDeselect, className, descriptionClassName, disabled, emptyText, gridClassName, items, itemsToIconMap, itemsToUrlMap, layout, onValueChange, orientation, ratio, ratioClassName, value }: SelectableGridProps<TItem>): ReactElement;

export declare interface SelectableGridItem {
    code: string;
    description: string;
    name: string;
}

export declare interface SelectableGridProps<TItem extends SelectableGridItem> extends ComponentProps<'div'> {
    descriptionClassName?: string;
    disabled?: boolean;
    allowDeselect?: boolean;
    emptyText: string;
    gridClassName?: string;
    items: TItem[];
    itemsToIconMap?: Record<string, LucideIcon>;
    itemsToUrlMap?: Record<string, string>;
    layout?: 'horizontal' | 'vertical';
    onValueChange?: (value: TItem | null) => void;
    orientation?: 'horizontal' | 'vertical';
    ratio?: number;
    ratioClassName?: string;
    value: TItem | null;
}

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

export declare const Sheet: typeof Dialog_2.Root;

declare function SheetBackdrop({ className, ...props }: Dialog_2.Backdrop.Props): default_2.ReactElement;
export { SheetBackdrop }
export { SheetBackdrop as SheetOverlay }

export declare function SheetClose(props: Dialog_2.Close.Props): default_2.ReactElement;

export declare function SheetDescription({ className, ...props }: Dialog_2.Description.Props): default_2.ReactElement;

export declare function SheetFooter({ className, variant, render, ...props }: useRender.ComponentProps<'div'> & {
    variant?: 'default' | 'bare';
}): default_2.ReactElement;

export declare function SheetHeader({ className, render, ...props }: useRender.ComponentProps<'div'>): default_2.ReactElement;

export declare function SheetPanel({ className, scrollFade, render, ...props }: useRender.ComponentProps<'div'> & {
    scrollFade?: boolean;
}): default_2.ReactElement;

declare function SheetPopup({ className, children, showCloseButton, side, variant, closeProps, portalProps, ...props }: Dialog_2.Popup.Props & {
    showCloseButton?: boolean;
    side?: 'right' | 'left' | 'top' | 'bottom';
    variant?: 'default' | 'inset';
    closeProps?: Dialog_2.Close.Props;
    portalProps?: Dialog_2.Portal.Props;
}): default_2.ReactElement;
export { SheetPopup as SheetContent }
export { SheetPopup }

export declare const SheetPortal: typeof Dialog_2.Portal;

export declare function SheetTitle({ className, ...props }: Dialog_2.Title.Props): default_2.ReactElement;

export declare function SheetTrigger(props: Dialog_2.Trigger.Props): default_2.ReactElement;

export declare function SheetViewport({ className, side, variant, ...props }: Dialog_2.Viewport.Props & {
    side?: 'right' | 'left' | 'top' | 'bottom';
    variant?: 'default' | 'inset';
}): default_2.ReactElement;

export declare function Sidebar({ side, variant, collapsible, className, children, ...props }: React_2.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
}): React_2.ReactElement;

export declare function SidebarContent({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare const SidebarContext: React_2.Context<SidebarContextProps | null>;

export declare interface SidebarContextProps {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
}

export declare function SidebarFooter({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarGroup({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarGroupAction({ className, render, ...props }: useRender.ComponentProps<'button'>): React_2.ReactElement;

export declare function SidebarGroupContent({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarGroupLabel({ className, render, ...props }: useRender.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarHeader({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarInput({ className, ...props }: React_2.ComponentProps<typeof Input_2>): React_2.ReactElement;

export declare function SidebarInset({ className, ...props }: React_2.ComponentProps<'main'>): React_2.ReactElement;

export declare function SidebarMenu({ className, ...props }: React_2.ComponentProps<'ul'>): React_2.ReactElement;

export declare function SidebarMenuAction({ className, showOnHover, render, ...props }: useRender.ComponentProps<'button'> & {
    showOnHover?: boolean;
}): React_2.ReactElement;

export declare function SidebarMenuBadge({ className, ...props }: React_2.ComponentProps<'div'>): React_2.ReactElement;

export declare function SidebarMenuButton({ isActive, variant, size, tooltip, className, render, ...props }: useRender.ComponentProps<'button'> & {
    isActive?: boolean;
    tooltip?: string | React_2.ComponentProps<typeof TooltipPopup>;
} & VariantProps<typeof sidebarMenuButtonVariants>): React_2.ReactElement;

declare const sidebarMenuButtonVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
    variant?: "default" | "outline" | null | undefined;
} & ClassProp) | undefined) => string;

export declare function SidebarMenuItem({ className, ...props }: React_2.ComponentProps<'li'>): React_2.ReactElement;

export declare function SidebarMenuSkeleton({ className, showIcon, ...props }: React_2.ComponentProps<'div'> & {
    showIcon?: boolean;
}): React_2.ReactElement;

export declare function SidebarMenuSub({ className, ...props }: React_2.ComponentProps<'ul'>): React_2.ReactElement;

export declare function SidebarMenuSubButton({ size, isActive, className, render, ...props }: useRender.ComponentProps<'a'> & {
    size?: 'sm' | 'md';
    isActive?: boolean;
}): React_2.ReactElement;

export declare function SidebarMenuSubItem({ className, ...props }: React_2.ComponentProps<'li'>): React_2.ReactElement;

export declare function SidebarProvider({ defaultOpen, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: React_2.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}): React_2.ReactElement;

export declare function SidebarRail({ className, ...props }: React_2.ComponentProps<'button'>): React_2.ReactElement;

export declare function SidebarSeparator({ className, ...props }: React_2.ComponentProps<typeof Separator>): React_2.ReactElement;

export declare function SidebarTrigger({ className, onClick, ...props }: React_2.ComponentProps<typeof Button_3>): React_2.ReactElement;

export declare function Skeleton({ className, ...props }: default_2.ComponentProps<'div'>): default_2.ReactElement;

export declare function Slider({ className, children, defaultValue, value, min, max, ...props }: SliderPrimitive.Root.Props): React_2.ReactElement;

export { SliderPrimitive }

export declare function SliderValue({ className, ...props }: SliderPrimitive.Value.Props): React_2.ReactElement;

export declare function Spinner({ className, ...props }: default_2.ComponentProps<typeof Loader2Icon>): default_2.ReactElement;

export declare function StackedPanel<Value = unknown>({ children, className, collapsible, defaultValue, empty, listClassName, onValueChange, style, trackClassName, value: valueProp, viewportClassName, ...props }: StackedPanelProps<Value>): default_2.ReactElement;

export declare function StackedPanelContent(_props: StackedPanelContentProps): default_2.ReactElement | null;

export declare type StackedPanelContentProps = default_2.ComponentPropsWithoutRef<'div'>;

export declare function StackedPanelItem<Value = unknown>(_props: StackedPanelItemProps<Value>): default_2.ReactElement | null;

export declare interface StackedPanelItemProps<Value = unknown> {
    children: default_2.ReactNode;
    disabled?: boolean;
    value: Value;
}

export declare interface StackedPanelProps<Value = unknown> extends Omit<TabsPrimitive.Root.Props, 'children' | 'defaultValue' | 'onValueChange' | 'orientation' | 'value'> {
    children: default_2.ReactNode;
    collapsible?: boolean;
    defaultValue?: Value | null;
    empty?: default_2.ReactNode;
    listClassName?: string;
    onValueChange?: (value: Value | null) => void;
    trackClassName?: string;
    value?: Value | null;
    viewportClassName?: string;
}

export declare function StackedPanelTrigger(_props: StackedPanelTriggerProps): default_2.ReactElement | null;

export declare interface StackedPanelTriggerProps extends Omit<TabsPrimitive.Tab.Props, 'children' | 'disabled' | 'value'> {
    children: default_2.ReactNode;
}

export declare function Stripes({ angle, color, gap, render, style, width, ...props }: StripesProps): ReactElement | null;

export declare interface StripesProps extends useRender.ComponentProps<'div', Record<string, never>> {
    [dataAttribute: `data-${string}`]: unknown;
    angle?: string;
    color?: string;
    gap?: string;
    width?: string;
}

export declare function Switch({ className, ...props }: SwitchPrimitive.Root.Props): default_2.ReactElement;

export declare function SwitchAnimation({ children, contentMode, direction, onSwitchChange, onSwitchComplete, onSwitchStart, ref: externalRef, render, style, ...props }: SwitchAnimationProps): ReactElement | null;

export declare interface SwitchAnimationCompleteDetails extends SwitchAnimationReplacementDetails {
    readonly status: SwitchAnimationCompletionStatus;
}

export declare type SwitchAnimationCompletionStatus = 'finished' | 'interrupted';

export declare type SwitchAnimationContentMode = 'flow' | 'phrasing';

export declare type SwitchAnimationDirection = 'down' | 'up' | 'left' | 'right';

export declare interface SwitchAnimationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    children: ReactElement;
    contentMode?: SwitchAnimationContentMode;
    direction?: SwitchAnimationDirection;
    onSwitchChange?: (details: SwitchAnimationReplacementDetails) => void;
    onSwitchComplete?: (details: SwitchAnimationCompleteDetails) => void;
    onSwitchStart?: (details: SwitchAnimationReplacementDetails) => void;
    ref?: SwitchAnimationRenderProps['ref'];
    render?: ReactElement | ((props: SwitchAnimationRenderProps, state: Record<string, never>) => ReactElement);
}

declare interface SwitchAnimationRenderProps extends HTMLAttributes<HTMLElement> {
    ref?: Ref<HTMLElement>;
}

export declare interface SwitchAnimationReplacementDetails {
    readonly direction: SwitchAnimationDirection;
    readonly nextKey: Key;
    readonly previousKey: Key;
    readonly replacementId: number;
}

export { SwitchPrimitive }

export declare function Table({ className, ...props }: React_2.ComponentProps<'table'>): React_2.ReactElement;

export declare function TableBody({ className, ...props }: React_2.ComponentProps<'tbody'>): React_2.ReactElement;

export declare function TableCaption({ className, ...props }: React_2.ComponentProps<'caption'>): React_2.ReactElement;

export declare function TableCell({ className, ...props }: React_2.ComponentProps<'td'>): React_2.ReactElement;

export declare function TableFooter({ className, ...props }: React_2.ComponentProps<'tfoot'>): React_2.ReactElement;

export declare function TableHead({ className, ...props }: React_2.ComponentProps<'th'>): React_2.ReactElement;

export declare function TableHeader({ className, ...props }: React_2.ComponentProps<'thead'>): React_2.ReactElement;

export declare function TableRow({ className, ...props }: React_2.ComponentProps<'tr'>): React_2.ReactElement;

export declare namespace Tabs {
    export {
        TabsIndicator as Indicator,
        TabsList as List,
        TabsPanel as Panel,
        TabsRoot as Root,
        TabsTab as Tab
    }
}

export declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): default_2.ReactElement;

export declare function TabsIndicator({ className, ref, render, renderBeforeHydration, style, ...props }: TabsIndicatorProps): ReactElement;

export declare namespace TabsIndicator {
    export type State = TabsIndicatorState;
    export type Props = TabsIndicatorProps;
}

export declare type TabsIndicatorProps = TabsPrimitive.Indicator.Props;

export declare type TabsIndicatorState = TabsPrimitive.Indicator.State;

export declare function TabsList({ children, className, style, ...props }: TabsListProps): ReactElement;

export declare namespace TabsList {
    export type State = TabsListState;
    export type Props = TabsListProps;
}

export declare type TabsListProps = TabsPrimitive.List.Props;

export declare type TabsListState = TabsPrimitive.List.State;

export declare function TabsPanel({ className, ...props }: TabsPanelProps): ReactElement;

export declare namespace TabsPanel {
    export type Metadata = TabsPanelMetadata;
    export type State = TabsPanelState;
    export type Props = TabsPanelProps;
}

export declare type TabsPanelMetadata = TabsPrimitive.Panel.Metadata;

export declare type TabsPanelProps = TabsPrimitive.Panel.Props;

export declare type TabsPanelState = TabsPrimitive.Panel.State;

export { TabsPrimitive }

export declare function TabsRoot({ defaultValue, dir, onValueChange, orientation, value, ...props }: TabsRootProps): ReactElement;

export declare namespace TabsRoot {
    export type Orientation = TabsRootOrientation;
    export type State = TabsRootState;
    export type Props = TabsRootProps;
    export type ChangeEventReason = TabsRootChangeEventReason;
    export type ChangeEventDetails = TabsRootChangeEventDetails;
}

export declare type TabsRootChangeEventDetails = TabsPrimitive.Root.ChangeEventDetails;

export declare type TabsRootChangeEventReason = TabsPrimitive.Root.ChangeEventReason;

export declare type TabsRootOrientation = TabsPrimitive.Root.Orientation;

export declare interface TabsRootProps extends Omit<TabsPrimitive.Root.Props, 'dir'> {
    dir?: 'ltr' | 'rtl';
}

export declare type TabsRootState = TabsPrimitive.Root.State;

export declare function TabsTab({ children, className, render, revealAnimation, ...props }: TabsTabProps): ReactElement;

export declare namespace TabsTab {
    export type Value = TabsTabValue;
    export type ActivationDirection = TabsTabActivationDirection;
    export type Position = TabsTabPosition;
    export type Size = TabsTabSize;
    export type Metadata = TabsTabMetadata;
    export type State = TabsTabState;
    export type Props = TabsTabProps;
}

export declare type TabsTabActivationDirection = TabsPrimitive.Tab.ActivationDirection;

export declare type TabsTabMetadata = TabsPrimitive.Tab.Metadata;

export declare type TabsTabPosition = TabsPrimitive.Tab.Position;

export declare type TabsTabProps = TabsPrimitive.Tab.Props & {
    revealAnimation?: TabsTabRevealAnimationProps;
};

export declare type TabsTabRevealAnimationProps = Omit<RevealAnimationProps, 'children' | 'render' | 'reveal'>;

export declare type TabsTabSize = TabsPrimitive.Tab.Size;

export declare type TabsTabState = TabsPrimitive.Tab.State;

export declare type TabsTabValue = TabsPrimitive.Tab.Value;

export declare function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): default_2.ReactElement;

export declare type TabsVariant = 'default' | 'underline';

declare function Text_2({ className, intent, render, size, tone, ...props }: TextProps): ReactElement | null;
export { Text_2 as Text }

export declare function Textarea({ className, size, unstyled, ref, ...props }: TextareaProps): React_2.ReactElement;

export declare type TextareaProps = React_2.ComponentPropsWithoutRef<'textarea'> & React_2.RefAttributes<HTMLTextAreaElement> & {
    size?: 'sm' | 'default' | 'lg' | number;
    unstyled?: boolean;
};

export declare type TextProps = useRender.ComponentProps<'span', Record<string, never>, ComponentPropsWithRef<'span'>> & ToneOrIntentProps & {
    size?: TextSize;
};

declare type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export declare const Tiles: TilesNamespace;

export declare type TilesArea = string;

export declare type TilesContainerBreakpoint = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

export declare type TilesLayout<Area extends TilesArea = TilesArea> = Readonly<{
    base: TilesMatrix<Area>;
} & Partial<Record<TilesContainerBreakpoint, TilesMatrix<Area>>>>;

export declare type TilesLayoutKey = 'base' | TilesContainerBreakpoint;

export declare type TilesMatrix<Area extends TilesArea = TilesArea> = readonly (readonly Area[])[];

export declare interface TilesNamespace {
    Root: typeof TilesRoot;
    ScrollableTile: typeof TilesScrollableTile;
    Tile: typeof TilesTile;
}

export declare function TilesRoot<Area extends TilesArea = TilesArea>({ border, children, frozen, layout, render, theme, ...props }: TilesRootProps<Area>): ReactElement;

export declare type TilesRootProps<Area extends TilesArea = TilesArea> = useRender.ComponentProps<'div', Record<string, never>> & {
    border?: 0 | 1 | 2 | 4 | 8;
    frozen?: boolean;
    layout: TilesLayout<Area>;
    theme?: TilesTheme;
};

export declare function TilesScrollableTile<Area extends TilesArea = TilesArea>({ area, children, render, role, stripesProps, theme, ...props }: TilesScrollableTileProps<Area>): ReactElement;

export declare type TilesScrollableTileProps<Area extends TilesArea = TilesArea> = TilesTileProps<Area>;

export declare type TilesTheme = 'inherit' | 'inverse';

export declare function TilesTile<Area extends TilesArea = TilesArea>(props: TilesTileProps<Area>): ReactElement;

export declare type TilesTileProps<Area extends TilesArea = TilesArea> = useRender.ComponentProps<'div', Record<string, never>> & {
    area: Area;
    stripesProps?: boolean | TilesTileStripesProps;
    theme?: TilesTheme;
};

export declare type TilesTileStripesProps = Pick<StripesProps, 'angle' | 'color' | 'gap' | 'width'>;

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

export declare type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'accent';

export declare type ToneOrIntentProps = {
    tone?: Tone;
    intent?: never;
} | {
    tone?: never;
    intent: Intent;
};

export declare function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props): default_2.ReactElement;

export declare function ToolbarButton({ className, ...props }: ToolbarPrimitive.Button.Props): default_2.ReactElement;

export declare function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props): default_2.ReactElement;

export declare function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props): default_2.ReactElement;

export declare function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props): default_2.ReactElement;

export { ToolbarPrimitive }

export declare function ToolbarSeparator({ className, ...props }: ToolbarPrimitive.Separator.Props): default_2.ReactElement;

export declare const Tooltip: typeof TooltipPrimitive.Root;

export declare const TooltipCreateHandle: typeof TooltipPrimitive.createHandle;

declare function TooltipPopup({ className, align, sideOffset, side, anchor, children, portalProps, ...props }: TooltipPrimitive.Popup.Props & {
    align?: TooltipPrimitive.Positioner.Props['align'];
    side?: TooltipPrimitive.Positioner.Props['side'];
    sideOffset?: TooltipPrimitive.Positioner.Props['sideOffset'];
    anchor?: TooltipPrimitive.Positioner.Props['anchor'];
    portalProps?: TooltipPrimitive.Portal.Props;
}): default_2.ReactElement;
export { TooltipPopup as TooltipContent }
export { TooltipPopup }

export { TooltipPrimitive }

export declare const TooltipProvider: typeof TooltipPrimitive.Provider;

export declare function TooltipTrigger(props: TooltipPrimitive.Trigger.Props): default_2.ReactElement;

export declare const Ui: UiNamespace;

export declare interface UiNamespace {
    Animations: AnimationsNamespace;
    Components: ComponentsNamespace;
}

export declare function useAutocompleteFilter(options?: AutocompleteFilterOptions): AutocompleteFilter;

export declare function useAutocompleteFilteredItems<ItemValue>(): ItemValue[];

export declare const useComboboxFilter: typeof ComboboxPrimitive.useFilter;

export declare function useIsMobile(): boolean;

export declare function useMediaQuery(query: BreakpointQuery | MediaQueryInput | (string & {})): boolean;

export declare function useSidebar(): SidebarContextProps;

export { }
