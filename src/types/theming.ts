import type { Typography } from '@material-ui/core/styles/createTypography';
import type { Palette, PaletteColor, TypeAction } from '@material-ui/core/styles/createPalette';
import type { Shape } from '@material-ui/core/styles/shape';
import type { BreakpointsOptions } from '@material-ui/core/styles/createBreakpoints';
import type { Overrides } from '@material-ui/core/styles/overrides';
import type { Color } from '@material-ui/core';
import type { ComponentsProps } from '@material-ui/core/styles/props';
import type { Shadows } from '@material-ui/core/styles/shadows';

export type EpilotTheme = {
    /**
     * prefix of the css classes
     */
    prefix?: string;
    /**
     * typography options
     */
    typography?: EpilotTypography;
    /**
     * colors palette options
     */
    palette?: EpilotPalette;
    /**
     * the space around the components
     */
    spacing?: number;
    /**
     * style for the container shape, currently only changes the border_radius
     */
    shape?: Shape;
    breakpoints?: BreakpointsOptions;
    /**
     * props we use to overwrite some material ui props
     */
    props?: {
        client_logo_url?: string;
        enable_ripple?: boolean;
        content_max_width?: number;
    };
    /**
     * Material UI components styling
     */
    muiOverrides?: EpilotOverrides;
    /**
     * Material UI components props
     */
    muiProps?: ComponentsProps;
    /**
     * Material UI components shadow
     */
    shadows?: Shadows;
}

export declare type EpilotTypography = Typography & {
    fontSource?: EpilotCustomFontSource[];
};

export declare type EpilotCustomFontSource = {
    fontFamily: string;
    fontStyle: string;
    fontDisplay: 'swap';
    fontWeight: 400 | 600 | 800;
    src: string;
};

export declare type EpilotColor = PaletteColor & Color & {
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
};

export declare type EpilotPalette = Palette & TagColors & {
    primary?: EpilotColor;
    secondary?: EpilotColor;
    grey?: EpilotColor;
    focus?: EpilotColor;
    tertiary?: EpilotColor;
    accent1?: EpilotColor;
    accent2?: EpilotColor;
    success?: EpilotColor;
    info?: EpilotColor;
    warning?: EpilotColor;
    error?: EpilotColor;
    action?: EpilotTypeAction;
    default?: EpilotColor;
};

export declare type EpilotTypeAction = TypeAction & {
    selectedText?: string;
};

export declare type EpilotOverrides = Overrides & {
    MuiTabPanel: any;
    MuiToggleButton: any;
    MuiAutocomplete: any;
};

export declare type TagColors = {
    green: EpilotColor;
    darkgrey: EpilotColor;
    bostonblue: EpilotColor;
    darkgreen: EpilotColor;
    purple: EpilotColor;
    pink: EpilotColor;
    lightblue: EpilotColor;
    blue: EpilotColor;
    lavender: EpilotColor;
    red: EpilotColor;
    cyan: EpilotColor;
    orange: EpilotColor;
};